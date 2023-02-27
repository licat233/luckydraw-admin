/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  const validateAccess = (...items: string[]) => {
    const accessValue = currentUser?.access;
    if (!accessValue) return
    for (let i = 0; i < items.length; i++) {
      if (items[i] === accessValue) {
        return true;
      }
    }
    return false
  }
  return {
    canAdmin: validateAccess('superAdmin'),
    canEdit: validateAccess('superAdmin', 'admin', 'normal'),
    canDel: validateAccess('superAdmin', 'admin'),
    canNew: validateAccess('superAdmin', 'admin', 'normal'),
  };
}
