# {Project} Agent Execution Log

**日期**: {DATE}
**类型**: Agent 高效执行格式

---

## EXEC_SUMMARY

```
项目: {PROJECT_NAME}
状态: {STATUS}
本次会话: {SESSION_SUMMARY}
```

---

## DELTA_CHANGES

### {MODULE_NAME}
```
[NEW] {file} - {description}
[FIX] {file} - {description}
[OPT] {file} - {description}
[DEL] {file} - {description}
```

---

## API_INVENTORY

### {API_GROUP}
```
GET    /api/{resource}              - {description}
POST   /api/{resource}              - {description}
PUT    /api/{resource}/:id          - {description}
DELETE /api/{resource}/:id          - {description}
```

---

## DB_SCHEMA

```
{table}: {column1}, {column2}, {column3}
```

---

## DEPLOY_CMD

```bash
# Worker
cd {worker_dir} && npx wrangler deploy

# Mini Program
node {upload_script}

# Context
llm-context {scripts_dir} js -i node_modules -i .git
repowise create
```

---

## NEXT_ACTIONS

```
[{PRIORITY}] {description}
```

---

## CONTEXT_OPT

```
对话压缩策略:
1. repowise create - 项目级上下文
2. llm-context - 代码级上下文
3. 本日志 - 执行状态追踪
4. Obsidian总结 - 知识沉淀
```

---

*Agent执行日志 v1.0 - DevFlow Automation*
