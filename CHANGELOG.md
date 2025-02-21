# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
## [2.13.9] - 2020-08-06
### Improved
- PB-1422 Add more button to the folders tree section title

### Fixed
- PB-1421 Fix grid/folders tree drag and drop with FF ESR 68

## [2.13.8] - 2020-08-05
### Fixed
- Update dependencies
- PB-1419 Unselect resources that are going to be deleted

## [2.13.7] - 2020-06-23
### Fixed
- Fix folders notifications settings issue

## [2.13.6] - 2020-06-19
### Fixed
- Update the folders local storage when a folders is selected or opened
- Update the folders local storage when the folders tree section is open or the root folder is selected
- Folder sidebar should highlight if a folder is shared or not
- Fix padding folders tree section

## [2.13.5] - 2020-06-16
### Added
-  As LU I can export all the folders from the folders tree title contextual menu
-  As LU I can export create a folder from the folders tree title contextual menu

## [2.13.4] - 2020-06-15
### Added
-  Folders activity sidebar integration
### Fixed
-  Update folders & resources local storage after group update/delete
-  Fix as lu I can search a resource by tag issue 

## [2.13.3] - 2020-06-11
### Fixed
- Fix folder sidebar permissions section when a folder is shared with a group

## [2.13.2] - 2020-06-05
### Added
- Add location information to the password secondary sidebar. Fix permissions alphabetical order issue in the secondary sidebars sections

### Fixed
- Fix as LU I should not be able to move a folder in read from a shared folder into a personal folder or the root

## [2.13.1] - 2020-05-28
### Fixed
- Passwords grid empty state

## [2.13.0] - 2020-05-27
### Added
- PB-658: Folders and relative works
- PB-582: Migrate add and update resource dialog to the extension

### Fixed
- PB-1222: Fix password details information sidebar look and feel

## [2.12.6] - 2020-04-14
### Fixed
- PB-1209: update cipherguard-mad

## [2.12.5] - 2020-04-14
### Fixed
- PB-1209: update dependencies

## [2.12.4] - 2019-12-05
### Fixed
- Fix update/delete tags

## [2.12.3] - 2019-12-04
### Fixed
- Update the cipherguard-mad dependency 

## [2.12.2] - 2019-12-04
### Fixed
- Add noreferrer to the password link from the information sidebar and grid contextual menu 

## [2.12.1] - 2019-12-04
### Fixed
- Replace profile dropdown fontawesome icon with a svg

## [2.12.0] - 2019-12-02
### Added
- PB-575: As AD I can see the MFA status of each user in the users grid
- PB-639: As LU I can delete a personal tag
- PB-687: As an admin I can resend an invitation for a user that didn't complete the setup
- PB-698: As an admin I can disable MFA for a user

### Fixed
- GITHUB-16: Opening an URI in a new tab leads to /SAFE_URI
- PB-883: Fix dependencies vulnerabilities

## [2.11.3] - 2019-08-07
### Fixed
- Don't display the session expired popup when the user clicks on logout

## [2.11.2] - 2019-08-04
### Fixed
- PB-611: Fix tags autocomplete can trigger XSS
- Fix password grid contextual menu, open uri in a new tab can trigger XSS

## [2.11.1] - 2019-08-02
### Fixed
- Fix plugin "is ready" detection

## [2.11.0] - 2019-08-02
### Improved
- PB-242: Performance - Fetch the passwords in priority
- Extend resource checkbox clickable area
- Select the just created resource
- Select created tag after the import of resources
- Unselect the select all checkbox if all passwords are not selected
- PB-567: Retrieve the user authenticated status from the browser extension

### Fixed
- Take in account the search even if the passwords list is not loaded
- Log the user out when the session is expired

## [2.10.4] - 2019-07-11
### Fixed
- PB-504: update dependencies

## [2.10.3] - 2019-07-10
### Fixed
- Publish latest build

## [2.10.2] - 2019-07-10
### Improved
- PB-391: As an admin deleting a user I should see the name and email of the user i'm about the delete in the model dialog
- PB-396: As a user deleting a password I should see the name of the password i’m about to delete in the modal
- PB-397: As a user in the user workspace, I should see a relevant feedback if a user is not a member of any group
- PB-364: Fix Pressing enter on tag editor doesn't hide autocomplete
- PB-366: Undeletable tags shouldn't have the "delete" button
- Migrate the passwords grid in react
- PB-242: Performance - The passwords should be fetched in priority
- Extend resource checkbox clickable area
- Select the just created resource

### Fixed
- PB-337: Tag autocomplete shows suggestions that are already in the list
- PB-425: Fix documentation URL in the Email Notification screen
- PB-416: As an admin using Yubikey I should be able to setup a secret key with a '+' sign in it

### Fixed
- Select created tag after the import of resources
- Unselect the select all checkbox if not all passwords are selected
- The search should be applied even if the passwords take long to load

## [2.10.1] - 2019-05-15
### Fixed
- PB-167: Email notification settings admin screen should be available on CE

## [2.10.0] - 2019-05-15
### Added
- PB-167: Email notification settings admin screen

### Improved
- PB-195: Ensure the requests to the API are made in v2

## [2.8.4] - 2019-04-15
### Improved
- PB-48: Performance - remove the creator/modifier from the resources workspace grid query
- PB-159: Remove the usage of canjs connect-hydrate module

### Fixed
- GITHUB-10: Selecting a group on the users workspace should not reset the grid "Last Logged In" column to "Never"
- GITHUB-62: Sorting the users on the users workspace should not break the infinite scroll
- PB-160: Update jquery

## [2.8.3] - 2019-04-10
### Fixed
- GITHUB-299: Fix - Passwords are shown twice in workspace list

## [2.8.2] - 2019-04-09
### Fixed
- PB-147: Update the steal dependency

## [2.8.1] - 2019-04-09
### Fixed
- GITHUB-315: Fix the permalink of the passwords

## [2.8.0] - 2019-04-01
### Added
- PB-1: Audit Logs - Browse the resources and see the activity logs to see who is doing what on them

### Improved
- CIPHERGUARD-3443: LDAP: Fix "in settings, username and password should not be compulsory fields"
- CIPHERGUARD-3327: LDAP: Improve administration UI
- CIPHERGUARD-3328: LDAP: Add test connection option

## [2.7.0] - 2019-02-06
### Added
- CIPHERGUARD-2978: Open a paginated grid on a page containing a target item
- CIPHERGUARD-3285: The url should be updated when the user is selecting a password
- CIPHERGUARD-2995: As LU I should be able to copy the permalink of a password
- CIPHERGUARD-3312: As GM adding a user to a group I should see a relevant feedback in case of network/proxy errors
- CIPHERGUARD-3318: As LU I should retrieve a secret when I'm copying it
- CIPHERGUARD-3319: As LU I should retrieve a secret when I'm editing it
- CIPHERGUARD-3403: As LU I should retrieve secrets when I'm exporting the associated passwords
- CIPHERGUARD-3397: Remove the list of secrets from the API request while loading the list of passwords

### Fixed
- CIPHERGUARD-3268: BaseDN should not be mandatory
- CIPHERGUARD-3269: Search on administration screen should be disabled

## [2.6.2] - 2018-12-04
### Fixed
- Only admin should see the admin panel navigation link

## [2.6.1] - 2018-12-04
### Fixed
- Fix users directory form typo

## [2.6.0] - 2018-12-04
### Added
- CIPHERGUARD-3130: As AD I can configure my users directory integration from the administration panel
- CIPHERGUARD-3121: As AD I can configure my multi factor authentication integrations from the administration panel
- CIPHERGUARD-3235: As AD I can synchronize my users directory from the administration panel

## [2.5.3] - 2018-11-17
### Improved
- Add travis job

## [2.5.2] - 2018-11-02
### Improved
- Add the build to the repository

## [2.5.1] - 2018-11-01
### Improved
- CIPHERGUARD-3188: As LU the UI shouldn't crash if a password uri cannot be parsed

## [2.5.0] - 2018-10-30
### Added
- CIPHERGUARD-3093: As LU I can select all passwords to perform a bulk operation

### Fixed
- CIPHERGUARD-3150: I should not see duplicates rows when I filter my passwords by keywords

## [2.4.0] - 2018-10-12
### Added
- CIPHERGUARD-2972: As LU I should be able to delete multiple passwords in bulk
- CIPHERGUARD-2983: As LU I should be able to share multiple passwords in bulk

### Improved
- CIPHERGUARD-3073: As LU I should get a visual feedback directly after filtering the passwords or the users workspace
- CIPHERGUARD-2972: As LU I should be able to select multiple passwords with standard keyboard interactions (command and shift keys)

### Fixed
- CIPHERGUARD-2534: As LU I should not be able to copy to clipboard empty login/url
- CIPHERGUARD-2017: As LU when I save a password (create/edit) the dialog shouldn't persist until the request is processed by the API
- CIPHERGUARD-3063: Fix appjs base url and subfolder
- CIPHERGUARD-3024: As LU I can access the theme manager screen via /settings/theme url
- CIPHERGUARD-2976: Fix API requests issues when the user is going to another workspace
- CIPHERGUARD-2982: Fix session expired check
- CIPHERGUARD-3086: As LU when I have 100+ passwords I cannot see the passwords after the 100th more than once

## [2.3.0] - 2018-08-30
### Fixed
- Route rewriting should take in account cipherguard installed in a subirectory
- CIPHERGUARD-2965: Group filter link stays active after switching to a non group filter
- Fix the loading bar stuck in the initialization state

### Improved
- CIPHERGUARD-2950: Display empty content feedbacks
- CIPHERGUARD-2971: Reset the workspaces when a resource or a user is created
- CIPHERGUARD-2267: As an admin deleting a user I can transfer ownership of this user shared passwords to another user that have read access.

## [2.2.0] - 2018-08-13
### Added
- CIPHERGUARD-2906: Enable CSRF protection

### Fixed
- CIPHERGUARD-2896: Fix filter by tag from the password details sidebar
- CIPHERGUARD-2903: Fix logout link. It should target a full based url link
- CIPHERGUARD-2926: Fix session timeout check
- CIPHERGUARD-2940: Implement routes
- CIPHERGUARD-2805: Sort by date fix and sort by user first_name by default

### Improved
- CIPHERGUARD-2933: Upgrade to canjs 4
- CIPHERGUARD-2941: Grid performance fix

## [2.1.0] - 2018-06-14
### Added
- CIPHERGUARD-2878: Integrate dark theme
- CIPHERGUARD-2861: Make username clickable for copy to clipboard

### Fixed
- CIPHERGUARD-1917: Upgrade to canjs 3.x
- CIPHERGUARD-2883: Fix logout link and remember me cleanup
- CIPHERGUARD-2886: Fix fingerprint tooltips in user group management dialog
- CIPHERGUARD-2894: Fix missing div breaking elipsis on long url in password workspace
- CIPHERGUARD-2891: Fix group edit users tooltips
- CIPHERGUARD-2884: Update header left menu. Remove home and add help
- CIPHERGUARD-2885: Update user settings menus
- CIPHERGUARD-2895: Fix/homogenize notifications

# Terminology
- AN: Anonymous user
- LU: Logged in user
- AP: User with plugin installed
- LU: Logged in user

[Unreleased]: https://github.com/cipherguard/cipherguard_api/compare/v2.13.9...HEAD
[2.13.9]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.13.8...v2.13.9
[2.13.8]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.13.7...v2.13.8
[2.13.7]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.13.6...v2.13.7
[2.13.6]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.13.5...v2.13.6
[2.13.5]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.13.4...v2.13.5
[2.13.4]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.13.3...v2.13.4
[2.13.3]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.13.2...v2.13.3
[2.13.2]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.13.1...v2.13.2
[2.13.1]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.13.0...v2.13.1
[2.13.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.12.6...v2.13.0
[2.12.6]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.12.5...v2.12.6
[2.12.5]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.12.4...v2.12.5
[2.12.4]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.12.3...v2.12.4
[2.12.3]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.12.2...v2.12.3
[2.12.2]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.12.1...v2.12.2
[2.12.1]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.12.0...v2.12.1
[2.12.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.11.3...v2.12.0
[2.11.3]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.11.2...v2.11.3
[2.11.2]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.11.1...v2.11.2
[2.11.1]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.11.0...v2.11.1
[2.11.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.10.4...v2.11.0
[2.10.4]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.10.3...v2.10.4
[2.10.3]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.10.2...v2.10.3
[2.10.2]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.10.1...v2.10.2
[2.10.1]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.10.0...v2.10.1
[2.10.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.8.4...v2.10.0
[2.8.4]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.8.3...v2.8.4
[2.8.3]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.8.2...v2.8.3
[2.8.2]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.8.1...v2.8.2
[2.8.1]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.8.0...v2.8.1
[2.8.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.7.0...v2.8.0
[2.7.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.6.2...v2.7.0
[2.6.2]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.6.1...v2.6.2
[2.6.1]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.6.0...v2.6.1
[2.6.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.5.3...v2.6.0
[2.5.3]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.5.2...v2.5.3
[2.5.2]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.5.1...v2.5.2
[2.5.1]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/cipherguard/cipherguard-appjs/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/cipherguard/cipherguard-appjs/compare/5df5207...v2.1.0
