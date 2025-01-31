import chalk from 'chalk';
import fetch from 'node-fetch';

import { DoctorCheck, DoctorCheckParams, DoctorCheckResult } from './checks.types';
import {
  getDirectoryCheckExcludes,
  getDirectoryCheckListUnknownPackagesEnabled,
} from '../utils/doctorConfig';

// Filter out common packages that don't make sense for us to validate on the directory.
const DEFAULT_PACKAGES_TO_IGNORE = [
  'react-native',
  'react',
  'react-dom',
  'react-native-web',
  'jest',
  /^babel-.*$/,
  /^@types\/.*$/,
];

export function filterPackages(packages: string[], ignoredPackages: (RegExp | string)[]) {
  return packages.filter((packageName) => {
    return ignoredPackages.every((ignoredPackage) => {
      if (ignoredPackage instanceof RegExp) {
        return !ignoredPackage.test(packageName);
      }
      return ignoredPackage !== packageName;
    });
  });
}

export class DirectoryCheck implements DoctorCheck {
  description = 'Validate packages against React Native Directory package metadata';

  sdkVersionRange = '>=51.0.0';

  async runAsync({ pkg }: DoctorCheckParams): Promise<DoctorCheckResult> {
    const issues: string[] = [];
    const newArchUnsupportedPackages: string[] = [];
    const newArchUntestedPackages: string[] = [];
    const unmaintainedPackages: string[] = [];
    const unknownPackages: string[] = [];
    const dependencies = pkg.dependencies ?? {};
    const userDefinedIgnoredPackages = getDirectoryCheckExcludes(pkg);
    const listUnknownPackagesEnabled = getDirectoryCheckListUnknownPackagesEnabled(pkg);

    const packageNames = filterPackages(Object.keys(dependencies), [
      ...DEFAULT_PACKAGES_TO_IGNORE,
      ...userDefinedIgnoredPackages,
    ]);

    try {
      const response = await fetch('https://reactnative.directory/api/libraries/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packages: packageNames }),
      });

      const packageMetadata = await response.json();

      packageNames.forEach((packageName) => {
        const metadata = packageMetadata[packageName];
        if (!metadata) {
          unknownPackages.push(packageName);
          return;
        }

        if (metadata.unmaintained) {
          unmaintainedPackages.push(packageName);
        }

        if (metadata.newArchitecture === 'untested') {
          newArchUntestedPackages.push(packageName);
        }

        if (metadata.newArchitecture === 'unsupported') {
          newArchUnsupportedPackages.push(packageName);
        }
      });
    } catch (error) {
      return {
        isSuccessful: false,
        issues: [`Directory check failed with error: ${error}`],
        advice: undefined,
      };
    }

    if (newArchUnsupportedPackages.length > 0) {
      issues.push(
        `${chalk.bold(`Unsupported on New Architecture:`)} ${newArchUnsupportedPackages.join(', ')}`
      );
    }

    if (newArchUntestedPackages.length > 0) {
      issues.push(
        `${chalk.bold(`Untested on New Architecture:`)} ${newArchUntestedPackages.join(', ')}`
      );
    }

    if (unmaintainedPackages.length > 0) {
      issues.push(`${chalk.bold(`Unmaintained:`)} ${unmaintainedPackages.join(', ')}`);
    }

    if (listUnknownPackagesEnabled && unknownPackages.length > 0) {
      issues.push(`${chalk.bold(`No metadata available`)}: ${unknownPackages.join(', ')}`);
    }

    if (issues.length) {
      issues.unshift(
        `The following issues were found when validating your dependencies against React Native Directory:`
      );
    }

    let advice = ``;

    if (
      unmaintainedPackages.length > 0 ||
      newArchUnsupportedPackages.length > 0 ||
      newArchUntestedPackages.length > 0
    ) {
      advice += `\n- Use libraries that are actively maintained and support the New Architecture. Find alternative libraries with ${chalk.bold('https://reactnative.directory')}.`;
      advice += `\n${chalk.bold('-')} Add packages to ${chalk.bold(
        'expo.doctor.directoryCheck.exclude'
      )} in package.json to selectively skip validations, if the warning is not relevant.`;
    }

    if (unknownPackages.length > 0) {
      advice += `\n${chalk.bold('-')} Update React Native Directory to include metadata for unknown packages. Alternatively, set ${chalk.bold(
        'expo.doctor.directoryCheck.listUnknownPackages'
      )} in package.json to ${chalk.bold('false')} to skip warnings about packages with no metadata, if the warning is not relevant.`;
    }

    return {
      isSuccessful: issues.length === 0,
      issues,
      advice: issues.length ? advice : undefined,
    };
  }
}
