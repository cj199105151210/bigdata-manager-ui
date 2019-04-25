const dicData = [{
  label: '开启',
  value: 'true'
}, {
  label: '关闭',
  value: 'false'
}]
export const list = [{
  key: 'showTag',
  commit: 'SET_SHOWTAG'
}, {
  key: 'showCollapse',
  commit: 'SET_SHOWCOLLAPSE'
}, {
  key: 'showMenu',
  commit: 'SET_SHOWMENU'
}]
export const option = (safe) => {
  const _safe = safe
  return {
    submitBtn: false,
    emptyBtn:false,
    column: [ {
      label: '缩放',
      prop: 'showCollapse',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }, {
      label: '顶部菜单',
      prop: 'showMenu',
      type: 'switch',
      span: 24,
      dicData: dicData,
      click: ({ column }) => {
        _safe.set(column.prop)
      }
    }]
  }
}
