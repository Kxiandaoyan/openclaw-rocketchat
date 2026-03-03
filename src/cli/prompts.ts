// ============================================================
// CLI 交互式输入工具
// 使用 Node.js 原生 readline，不依赖第三方库
// ============================================================

import { createInterface } from "node:readline";

const rl = () =>
  createInterface({
    input: process.stdin,
    output: process.stdout,
  });

/** 提示用户输入（带可选默认值） */
export function ask(
  question: string,
  defaultValue?: string,
): Promise<string> {
  return new Promise((resolve) => {
    const r = rl();
    const prompt = defaultValue
      ? `${question} [默认 ${defaultValue}]: `
      : `${question}: `;

    r.question(prompt, (answer) => {
      r.close();
      const value = answer.trim() || defaultValue || "";
      resolve(value);
    });
  });
}

/** 提示用户输入密码（明文输入） */
export function askPassword(question: string): Promise<string> {
  return new Promise((resolve) => {
    const r = rl();
    r.question(`${question}: `, (answer) => {
      r.close();
      resolve(answer.trim());
    });
  });
}

/** 提示用户确认 [y/N] */
export async function confirm(
  question: string,
  defaultYes = false,
): Promise<boolean> {
  const hint = defaultYes ? "[Y/n]" : "[y/N]";
  const answer = await ask(`${question} ${hint}`);

  if (!answer) return defaultYes;
  return answer.toLowerCase().startsWith("y");
}

/** 让用户从列表中选择（单选） */
export async function select(
  question: string,
  options: { label: string; value: string }[],
): Promise<string> {
  console.log(`\n${question}`);
  for (let i = 0; i < options.length; i++) {
    console.log(`  ${i + 1}) ${options[i].label}`);
  }

  while (true) {
    const answer = await ask("请选择");
    const idx = parseInt(answer, 10) - 1;
    if (idx >= 0 && idx < options.length) {
      return options[idx].value;
    }
    console.log("  无效选择，请重新输入");
  }
}

/** 让用户从列表中选择（多选，逗号分隔） */
export async function multiSelect(
  question: string,
  options: { label: string; value: string }[],
  allowEmpty = false,
): Promise<string[]> {
  console.log(`\n${question}`);
  for (let i = 0; i < options.length; i++) {
    console.log(`  ${i + 1}) ${options[i].label}`);
  }

  while (true) {
    const hint = allowEmpty ? "（回车跳过）" : "（逗号分隔，如 1,2）";
    const answer = await ask(`请选择${hint}`);

    if (!answer && allowEmpty) return [];
    if (!answer) continue;

    const indices = answer
      .split(",")
      .map((s) => parseInt(s.trim(), 10) - 1)
      .filter((i) => i >= 0 && i < options.length);

    if (indices.length > 0) {
      return indices.map((i) => options[i].value);
    }
    console.log("  无效选择，请重新输入");
  }
}

/** 打印带颜色的状态消息 */
export function info(msg: string): void {
  console.log(`  ${msg}`);
}

export function success(msg: string): void {
  console.log(`  ✅ ${msg}`);
}

export function warn(msg: string): void {
  console.log(`  ⚠️  ${msg}`);
}

export function error(msg: string): void {
  console.log(`  ❌ ${msg}`);
}

export function step(msg: string): void {
  console.log(`  ⏳ ${msg}`);
}

export function heading(title: string): void {
  console.log("");
  console.log(`=== ${title} ===`);
  console.log("");
}
