import Database from "@tauri-apps/plugin-sql";
import {isDesktop} from "./native";
import {readDemo, seedWorkspace, writeDemo, type WorkspaceData} from "./model";
let database:Database|null=null;
async function open():Promise<Database>{
  if(database)return database;
  const db=await Database.load("sqlite:workspace_preview.db");
  await db.execute("CREATE TABLE IF NOT EXISTS preview_state (id TEXT PRIMARY KEY, json TEXT NOT NULL, updated_at TEXT NOT NULL)");
  database=db;
  return db;
}
/** Somente dados fictícios do preview. Não é armazenamento de credenciais nem sincronização SMB. */
export async function loadPreview():Promise<WorkspaceData>{
  if(!isDesktop())return readDemo();
  const db=await open();
  const rows=await db.select<{json:string}[]>("SELECT json FROM preview_state WHERE id = $1",["workspace"]);
  if(!rows.length)return seedWorkspace();
  const parsed:unknown=JSON.parse(rows[0].json);
  if(typeof parsed!=="object"||parsed===null||!("version" in parsed)||(parsed as WorkspaceData).version!==1)throw Error("Versão de dados não suportada");
  return parsed as WorkspaceData;
}
export async function savePreview(data:WorkspaceData):Promise<void>{
  if(!isDesktop()){writeDemo(data);return}
  const db=await open();
  await db.execute("INSERT INTO preview_state(id,json,updated_at) VALUES($1,$2,$3) ON CONFLICT(id) DO UPDATE SET json = excluded.json, updated_at = excluded.updated_at",["workspace",JSON.stringify(data),new Date().toISOString()]);
}
