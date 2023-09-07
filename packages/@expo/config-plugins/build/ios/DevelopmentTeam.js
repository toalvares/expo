"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevelopmentTeamFromBuildConfiguration = getDevelopmentTeamFromBuildConfiguration;
exports.setDevelopmentTeamForBuildConfiguration = setDevelopmentTeamForBuildConfiguration;
exports.updateDevelopmentTeamForPbxproj = updateDevelopmentTeamForPbxproj;
exports.withAppleDevelopmentTeam = void 0;
function _Target() {
  const data = require("./Target");
  _Target = function () {
    return data;
  };
  return data;
}
function _Xcodeproj() {
  const data = require("./utils/Xcodeproj");
  _Xcodeproj = function () {
    return data;
  };
  return data;
}
function _string() {
  const data = require("./utils/string");
  _string = function () {
    return data;
  };
  return data;
}
function _iosPlugins() {
  const data = require("../plugins/ios-plugins");
  _iosPlugins = function () {
    return data;
  };
  return data;
}
/**
 * Set the Apple development team ID for all build configurations using the first native target.
 */
const withAppleDevelopmentTeam = (config, {
  developmentTeam
} = {}) => {
  return (0, _iosPlugins().withXcodeProject)(config, config => {
    // TODO: maybe infer from `EXPO_APPLE_TEAM_ID` env variable?
    // @ts-expect-error TODO: add to config types
    const teamId = developmentTeam ?? config.ios?.developmentTeam;
    if (teamId) {
      config.modResults = updateDevelopmentTeamForPbxproj(config.modResults, teamId);
    }
    return config;
  });
};

/** Get the Apple development team ID from an XCBuildConfiguration object */
exports.withAppleDevelopmentTeam = withAppleDevelopmentTeam;
function getDevelopmentTeamFromBuildConfiguration(xcBuildConfiguration) {
  const developmentTeam = xcBuildConfiguration.buildSettings.DEVELOPMENT_TEAM;
  if (developmentTeam) {
    return (0, _string().trimQuotes)(developmentTeam);
  }
  return null;
}

/** Set the Apple development team ID for an XCBuildConfiguration object */
function setDevelopmentTeamForBuildConfiguration(xcBuildConfiguration, developmentTeam) {
  if (developmentTeam) {
    xcBuildConfiguration.buildSettings.DEVELOPMENT_TEAM = `${developmentTeam}`;
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
function updateDevelopmentTeamForPbxproj(project, developmentTeam) {
  const [, nativeTarget] = (0, _Target().findFirstNativeTarget)(project);
  (0, _Xcodeproj().getBuildConfigurationsForListId)(project, nativeTarget.buildConfigurationList).forEach(([, buildConfig]) => setDevelopmentTeamForBuildConfiguration(buildConfig, developmentTeam));
  return project;
}
//# sourceMappingURL=DevelopmentTeam.js.map