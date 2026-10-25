export type View = "home"|"tasks"|"calendar"|"projects"|"insights"|"team"|"settings";
export type Priority = "Baixa"|"Média"|"Alta"|"Urgente";
export type TaskStatus = "Pendente"|"Em andamento"|"Concluída";
export type ProjectStatus = "Planejamento"|"Em andamento"|"Em revisão"|"Concluído";
export type Theme = "light"|"dark";
export interface Task {id:string;title:string;projectId:string|null;priority:Priority;status:TaskStatus;dueDate:string|null;createdAt:string;updatedAt:string}
export interface Project {id:string;name:string;description:string;status:ProjectStatus;dueDate:string|null;color:string}
export interface FocusState {endsAt:number|null;remainingSeconds:number;durationMinutes:number;active:boolean;paused:boolean}
export interface WorkspaceData {version:1;tasks:Task[];projects:Project[];theme:Theme;reduceTransparency:boolean;focus:FocusState}
export interface WindowsIdentity {sid:string;account:string;domain:string;username:string}
const today=new Date();
const dateAfter=(days:number)=>{const d=new Date(today);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const demoProjects:Project[]=[
  {id:"p1",name:"Experiência digital",description:"Evolução dos canais de atendimento",status:"Em andamento",dueDate:dateAfter(18),color:"#cc092f"},
  {id:"p2",name:"Qualidade dos dados",description:"Governança e consistência dos indicadores",status:"Em revisão",dueDate:dateAfter(9),color:"#8675bb"},
  {id:"p3",name:"Portal comercial",description:"Acompanhamento de oportunidades e demandas",status:"Planejamento",dueDate:dateAfter(45),color:"#bd885a"}
];
const seed=(id:string,title:string,pid:string,offset:number,priority:Priority,status:TaskStatus="Pendente"):Task=>({id,title,projectId:pid,priority,status,dueDate:dateAfter(offset),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
export function seedWorkspace():WorkspaceData{return {version:1,projects:demoProjects,tasks:[
  seed("t1","Revisar indicadores de desempenho","p1",0,"Alta"),
  seed("t2","Validar qualidade da base consolidada","p2",1,"Urgente"),
  seed("t3","Documentar regras de negócio","p3",2,"Média"),
  seed("t4","Alinhar critérios de aceite","p1",3,"Alta"),
  seed("t5","Revisar dicionário de dados","p2",-1,"Média","Concluída"),
  seed("t6","Consolidar melhorias da experiência","p1",5,"Baixa")],theme:"light",reduceTransparency:false,focus:{endsAt:null,remainingSeconds:25*60,durationMinutes:25,active:false,paused:false}}}
const KEY="bradescor.workspace.demo.v1";
export function readDemo():WorkspaceData{try{const raw=localStorage.getItem(KEY);if(raw){const data=JSON.parse(raw) as WorkspaceData;if(data.version===1&&Array.isArray(data.tasks)&&Array.isArray(data.projects))return data;}}catch{ /* malformed storage ignored */ }return seedWorkspace()}
export function writeDemo(data:WorkspaceData){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{/* no storage permission */}}
export function dueLabel(date:string|null){if(!date)return "Sem prazo";const todayStr=dateAfter(0);if(date===todayStr)return "Hoje";if(date<todayStr)return "Atrasada";return new Date(date+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})}
export function newId(){return crypto.randomUUID()}
