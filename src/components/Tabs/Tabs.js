import { TabsComponent } from "./styled";

export const Tabs = ({
  defaultActiveKey,
  type,
  size,
  tabList,
  onChange,
}) => {
  return (
    <TabsComponent
      defaultActiveKey={defaultActiveKey}
      type={type}
      size={size}
      onChange={onChange}
    >
      {tabList.map((el, i) => {
        return (
          <TabsComponent.TabPane tab={el.tab} key={i}>
            {el.component}
          </TabsComponent.TabPane>
        )
      })}
    </TabsComponent>
  )
}