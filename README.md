[![Moodle Plugin CI](https://github.com/oncampus/moodle-tiny_injectcss/actions/workflows/moodle-plugin-ci.yml/badge.svg)](https://github.com/oncampus/moodle-tiny_injectcss/actions/workflows/moodle-plugin-ci.yml)

# Inject CSS

This plugin inserts the CSS of the selected Moodle theme into the TinyMCE editor to ensure that the text's appearance in the editor matches how it will actually display.

## Features
The entirety of the themes CSS is inserted into the TinyMCE editor.

### Usage
Make sure that the plugin is enabled under Site administration > Plugins > Text editors > TinyMCE editor > Inject CSS.
The CSS of the theme should be inserted automatically into the TinyMCE editor.
No further configuration is required.

## Installation
Choose one of the following installation methods:
### Installation via ZIP file
1. Log in to your Moodle site as an administrator and go to Site administration > Plugins > Install plugins.
2. Upload the ZIP file containing the plugin code. You should only be prompted to add extra details if your plugin type is not automatically detected.
3. Check the plugin validation report and finish the installation.

### Installing manually
1. You can also install the plugin by copying the contents of this directory to
   ```
	{your/moodle/dirroot}/public/lib/editor/tiny/plugins/injectcss
	```
2. Afterwards, log in to your Moodle site as an administrator and go to Site administration > Notifications to complete the installation.
3. Alternatively, run the following command in the Moodle root directory:
   ```
   $ php admin/cli/upgrade.php 
   ```

## License
2025 oncampus GmbH <support@oncampus.de>
