const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/model.ts'), 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const store = new Map();
const moduleShim = { exports: {} };
const context = {
  module: moduleShim, exports: moduleShim.exports,
  localStorage: { getItem: key => store.get(key) || null, setItem: (key,val) => store.set(key,val) },
  Date, String, Math, JSON,
  crypto: { randomUUID: ()=>'test-uuid' }
};
vm.runInNewContext(transpiled, context);
const model = moduleShim.exports;

test('seed is fictional, structured and contains no meetings', () => {
  const data = model.seedWorkspace();
  assert.equal(data.version, 1);
  assert.ok(data.tasks.length >= 3);
  assert.ok(data.projects.length >= 2);
  assert.ok(data.tasks.every(t => ['Pendente','Concluída','Em andamento'].includes(t.status)));
  assert.equal(Object.hasOwn(data, 'meetings'), false);
});

test('task changes survive preview serialization', () => {
  const data = model.seedWorkspace();
  data.tasks[0].title = 'Tarefa de teste';
  model.writeDemo(data);
  assert.equal(model.readDemo().tasks[0].title, 'Tarefa de teste');
});

test('malformed stored preview data does not break startup', () => {
  store.set('bradescor.workspace.demo.v1', '{invalid json');
  assert.equal(model.readDemo().version, 1);
});

test('calendar labels overdue tasks without depending on UTC', () => {
  assert.equal(model.dueLabel(null), 'Sem prazo');
  assert.equal(model.dueLabel('2000-01-01'), 'Atrasada');
});

test('Tauri config and Rust identity do not accept a caller-supplied SID', () => {
  const rust = fs.readFileSync(path.join(root, 'src-tauri/src/lib.rs'),'utf8');
  assert.match(rust, /GetTokenInformation/);
  assert.match(rust, /LookupAccountSidW/);
  assert.match(rust, /ConvertSidToStringSidW/);
  assert.match(rust, /fn get_windows_identity\(\)/);
  const conf = JSON.parse(fs.readFileSync(path.join(root,'src-tauri/tauri.conf.json'),'utf8'));
  assert.match(conf.identifier, /workspace\.preview$/);
});
