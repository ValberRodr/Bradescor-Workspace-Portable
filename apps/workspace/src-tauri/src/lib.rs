use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct WindowsIdentity {
    sid: String,
    account: String,
    domain: String,
    username: String,
}

/// Native identity is informational until authorization and Windows ACLs are implemented.
/// Never accept the username or SID supplied from the JavaScript/frontend.
#[tauri::command]
fn get_windows_identity() -> Result<WindowsIdentity, String> {
    #[cfg(windows)]
    {
        return windows_identity();
    }
    #[cfg(not(windows))]
    {
        Err("Identidade Windows disponível somente no aplicativo Windows".into())
    }
}

#[cfg(windows)]
fn windows_identity() -> Result<WindowsIdentity, String> {
    use std::{ffi::c_void, ptr};
    use windows_sys::Win32::Foundation::{CloseHandle, LocalFree};
    use windows_sys::Win32::Security::{
        GetTokenInformation, LookupAccountSidW, OpenProcessToken, TokenUser, TOKEN_QUERY,
        TOKEN_USER, SID_NAME_USE,
    };
    use windows_sys::Win32::Security::Authorization::ConvertSidToStringSidW;
    use windows_sys::Win32::System::Threading::GetCurrentProcess;

    // The process access token is the source of identity; not environment variables.
    unsafe {
        let mut token = ptr::null_mut();
        if OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &mut token) == 0 {
            return Err("Não foi possível abrir token da sessão Windows".into());
        }
        let result = (|| {
            let mut required = 0_u32;
            GetTokenInformation(token, TokenUser, ptr::null_mut(), 0, &mut required);
            if required == 0 { return Err("Token de usuário indisponível".into()); }
            let mut storage = vec![0_u8; required as usize];
            if GetTokenInformation(token, TokenUser, storage.as_mut_ptr() as *mut c_void, required, &mut required) == 0 {
                return Err("Falha ao ler SID do token".into());
            }
            let sid = (*(storage.as_ptr() as *const TOKEN_USER)).User.Sid;
            if sid.is_null() { return Err("SID vazio".into()); }

            let mut sid_ptr: *mut u16 = ptr::null_mut();
            if ConvertSidToStringSidW(sid, &mut sid_ptr) == 0 || sid_ptr.is_null() {
                return Err("Não foi possível formatar SID".into());
            }
            let mut len = 0_usize;
            while *sid_ptr.add(len) != 0 { len += 1; }
            let sid_string = String::from_utf16_lossy(std::slice::from_raw_parts(sid_ptr, len));
            LocalFree(sid_ptr as isize);

            let mut name_len = 0_u32;
            let mut domain_len = 0_u32;
            let mut sid_use: SID_NAME_USE = 0;
            LookupAccountSidW(ptr::null(), sid, ptr::null_mut(), &mut name_len, ptr::null_mut(), &mut domain_len, &mut sid_use);
            if name_len == 0 { return Err("Não foi possível resolver conta do SID".into()); }
            let mut name_buffer = vec![0u16; name_len as usize];
            let mut domain_buffer = vec![0u16; domain_len.max(1) as usize];
            if LookupAccountSidW(ptr::null(), sid, name_buffer.as_mut_ptr(), &mut name_len, domain_buffer.as_mut_ptr(), &mut domain_len, &mut sid_use) == 0 {
                return Err("Falha ao resolver domínio e usuário da conta".into());
            }
            let username = String::from_utf16_lossy(&name_buffer[..name_len as usize]);
            let domain = String::from_utf16_lossy(&domain_buffer[..domain_len as usize]);
            let account = if domain.is_empty() { username.clone() } else { format!("{}\\{}", domain, username) };
            Ok(WindowsIdentity { sid: sid_string, account, domain, username })
        })();
        CloseHandle(token);
        result
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_windows_identity])
        .run(tauri::generate_context!())
        .expect("Erro ao iniciar o Bradescor Workspace");
}
