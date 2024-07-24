import path from "path";

const getHooks = async (hooks) => {
  const len = hooks.length;
  const allHooks = [];
  for (let i = 0; i < len; i++) {
    // const hook = await import(path.join(__dirname, "../hooks", hooks[i]));
    const hook = await import(`@lib/hooks/${hooks[i]}`);

    allHooks.push(hook);
  }

  return allHooks;
};

export const setHooks = async (app, hooks) => {
  const allHooks = await getHooks(hooks);
  for (const hook of allHooks) {
    try {
      // 调用hooks
      await hook.default(app);
    } catch (err) {}
  }
};
