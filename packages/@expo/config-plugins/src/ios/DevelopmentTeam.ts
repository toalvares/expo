import type { ExpoConfig } from '@expo/config-types';
import type { XCBuildConfiguration } from 'xcode';

import { findFirstNativeTarget } from './Target';
import { getBuildConfigurationsForListId } from './utils/Xcodeproj';
import { trimQuotes } from './utils/string';
import type { ConfigPlugin, XcodeProject } from '../Plugin.types';
import { withXcodeProject } from '../plugins/ios-plugins';

/**
 * Set the Apple development team ID for all build configurations using the first native target.
 */
export const withAppleDevelopmentTeam: ConfigPlugin<{ developmentTeam?: string } | void> = (
  config,
  { developmentTeam } = {}
) => {
  return withXcodeProject(config, (config) => {
    // TODO: maybe infer from `EXPO_APPLE_TEAM_ID` env variable?
    const teamId = developmentTeam ?? getDevelopmentTeam(config);
    if (teamId) {
      config.modResults = updateDevelopmentTeamForPbxproj(config.modResults, teamId);
    }

    return config;
  });
};

/** Get the Apple development team ID from Expo config, if defined */
export function getDevelopmentTeam(config: Pick<ExpoConfig, 'ios'>): string | null {
  return config.ios?.developmentTeam ?? null;
}

/** Get the Apple development team ID from an XCBuildConfiguration object */
export function getDevelopmentTeamFromBuildConfiguration(
  xcBuildConfiguration: XCBuildConfiguration
): string | null {
  const developmentTeam = xcBuildConfiguration.buildSettings.DEVELOPMENT_TEAM;
  if (developmentTeam) {
    return trimQuotes(developmentTeam);
  }

  return null;
}

/** Set the Apple development team ID for an XCBuildConfiguration object */
export function setDevelopmentTeamForBuildConfiguration(
  xcBuildConfiguration: XCBuildConfiguration,
  developmentTeam?: string
): void {
  if (developmentTeam) {
    xcBuildConfiguration.buildSettings.DEVELOPMENT_TEAM = trimQuotes(developmentTeam);
  } else {
    delete xcBuildConfiguration.buildSettings.DEVELOPMENT_TEAM;
  }
}

/**
 * Update the Apple development team ID for all XCBuildConfiguration entries using the first native target
 *
 * A development team is stored as a value in XCBuildConfiguration entry.
 * Those entries exist for every pair (build target, build configuration).
 * Unless target name is passed, the first target defined in the pbxproj is used
 * (to keep compatibility with the inaccurate legacy implementation of this function).
 */
export function updateDevelopmentTeamForPbxproj(
  project: XcodeProject,
  developmentTeam?: string
): XcodeProject {
  const [, nativeTarget] = findFirstNativeTarget(project);

  getBuildConfigurationsForListId(project, nativeTarget.buildConfigurationList).forEach(
    ([, buildConfig]) => setDevelopmentTeamForBuildConfiguration(buildConfig, developmentTeam)
  );

  return project;
}
