import { ReactNode, PureComponent } from 'react';
import type { VideoViewProps } from './VideoView.types';
/**
 * Returns whether the current device supports Picture in Picture (PiP) mode.
 *
 * > **Note:** All major web browsers, except Firefox, support Picture in Picture (PiP) mode.
 * > For more information, see [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API#browser_compatibility).
 * @returns A `boolean` which is `true` if the device supports PiP mode, and `false` otherwise.
 */
export declare function isPictureInPictureSupported(): boolean;
export declare class VideoView extends PureComponent<VideoViewProps> {
    nativeRef: import("react").RefObject<any>;
    /**
     * Enters fullscreen mode.
     */
    enterFullscreen(): void;
    /**
     * Exits fullscreen mode.
     */
    exitFullscreen(): void;
    /**
     * Enters Picture in Picture (PiP) mode. Throws an exception if the device does not support PiP.
     * > **Note:** Only one player can be in Picture in Picture (PiP) mode at a time.
     *
     * > **Note:** The `supportsPictureInPicture` property of the [config plugin](#configuration-in-appjsonappconfigjs)
     * > has to be configured for the PiP to work.
     * @platform android
     * @platform ios 14+
     * @platform web
     */
    startPictureInPicture(): void;
    /**
     * Exits Picture in Picture (PiP) mode.
     * @platform android
     * @platform ios 14+
     * @platform web
     */
    stopPictureInPicture(): void;
    render(): ReactNode;
}
//# sourceMappingURL=VideoView.d.ts.map