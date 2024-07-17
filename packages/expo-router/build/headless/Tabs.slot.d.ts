/// <reference types="react" />
import { Route, TabsDescriptor } from './Tabs.common';
export type UseTabsSlotOptions = {
    detachInactiveScreens?: boolean;
    renderFn?: typeof defaultTabsSlotRender;
};
export type TabsSlotRenderOptions = {
    index: number;
    isFocused: boolean;
    loaded: boolean;
    detachInactiveScreens: boolean;
};
export declare function useTabSlot({ detachInactiveScreens, renderFn, }?: UseTabsSlotOptions): (JSX.Element | null)[];
export declare function TabSlot(): (JSX.Element | null)[];
export declare function defaultTabsSlotRender(route: Route, descriptor: TabsDescriptor, { isFocused, loaded, detachInactiveScreens }: TabsSlotRenderOptions): JSX.Element | null;
//# sourceMappingURL=Tabs.slot.d.ts.map