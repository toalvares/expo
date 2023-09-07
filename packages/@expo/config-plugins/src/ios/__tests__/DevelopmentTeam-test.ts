import { ExpoConfig } from '@expo/config-types';
import { fs as memfs, vol } from 'memfs';
import path from 'path';

import {
  getDevelopmentTeam,
  getDevelopmentTeamFromBuildConfiguration,
  setDevelopmentTeamForBuildConfiguration,
  updateDevelopmentTeamForPbxproj,
} from '../DevelopmentTeam';

const baseExpoConfig: ExpoConfig = {
  name: 'testproject',
  slug: 'testproject',
  platforms: ['ios'],
  version: '1.0.0',
};

jest.mock('fs');

describe('DevelopmentTeam module', () => {
  describe(getDevelopmentTeam, () => {
    it('returns `null` if no `developmentTeam` is set', () => {
      expect(getDevelopmentTeam(baseExpoConfig)).toBe(null);
    });

    it('returns the `developmentTeam` when provided', () => {
      const expoConfig = { ...baseExpoConfig, ios: { developmentTeam: 'X0XX00XXXX' } };
      expect(getDevelopmentTeam(expoConfig)).toBe('X0XX00XXXX');
    });
  });

  describe(getDevelopmentTeamFromBuildConfiguration, () => {
    it('returns `null` if no `DEVELOPMENT_TEAM` is set', () => {
      expect(
        getDevelopmentTeamFromBuildConfiguration({
          
        })
      ).toBe(null);
    });

    it('returns the `DEVELOPMENT_TEAM` when provided', () => {

    });
  });

  describe(setDevelopmentTeamForBuildConfiguration, () => {
    // adds the `DEVELOPMENT_TEAM` when providing a team id
    // removes the `DEVELOPMENT_TEAM` when not providing a team id
  });

  describe(updateDevelopmentTeamForPbxproj, () => {
    // adds the `DEVELOPMENT_TEAM` to all build configurations when providing a team id
    // removes the `DEVELOPMENT_TEAM` from all build configurations when not providing a team id
  });

  describe('withAppleDevelopmentTeam', () => {
    // sets the `DEVELOPMENT_TEAM` when providing a team id
    // does not modify project when no `developmentTeam` is provided
  });

  // TODO: handle multi-target projects?
});
