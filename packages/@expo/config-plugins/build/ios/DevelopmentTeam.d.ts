import type { XCBuildConfiguration } from 'xcode';
import type { ConfigPlugin, XcodeProject } from '../Plugin.types';
/**
 * Set the Apple development team ID for all build configurations using the first native target.
 */
export declare const withAppleDevelopmentTeam: ConfigPlugin<{
    developmentTeam?: string;
} | void>;
/** Get the Apple development team ID from an XCBuildConfiguration object */
export declare function getDevelopmentTeamFromBuildConfiguration(xcBuildConfiguration: XCBuildConfiguration): string | null;
/** Set the Apple development team ID for an XCBuildConfiguration object */
export declare function setDevelopmentTeamForBuildConfiguration(xcBuildConfiguration: XCBuildConfiguration, developmentTeam?: string): void;
/**
 * Update the Apple development team ID for all XCBuildConfiguration entries using the first native target
 *
 * A development team is stored as a value in XCBuildConfiguration entry.
 * Those entries exist for every pair (build target, build configuration).
 * Unless target name is passed, the first target defined in the pbxproj is used
 * (to keep compatibility with the inaccurate legacy implementation of this function).
 */
export declare function updateDevelopmentTeamForPbxproj(project: XcodeProject, developmentTeam?: string): XcodeProject;
