import {isTauri} from "@tauri-apps/api/core";
import {invoke} from "@tauri-apps/api/core";
import type {WindowsIdentity} from "./model";
/** A leitura do SID usa API Win32 no processo Rust; não aceitar identidade do JS como login. */
export async function getWindowsIdentity():Promise<WindowsIdentity|null>{
  if(!isTauri())return null;
  return invoke<WindowsIdentity>("get_windows_identity");
}
export function isDesktop():boolean{return isTauri()}
