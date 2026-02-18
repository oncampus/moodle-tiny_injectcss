// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Tiny tiny_injectcss for Moodle. Inspired by tiny_elediastyles made by https://eledia.de/
 *
 * @module      tiny_injectcss/plugin
 * @copyright   2025 oncampus GmbH <support@oncampus.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getTinyMCE} from 'editor_tiny/loader';
import {getPluginMetadata} from 'editor_tiny/utils';
import {component, pluginName} from './common';

/**
 * Converts /editor stylesheets into /all stylesheets.
 * @param {Object} editor
 * @returns {boolean}
 */
const handleNormalMode = (editor) => {
    const doc = editor.getDoc();

    const editorRegex = /\/theme\/styles\.php\/[^/]+\/[^/]+\/editor$/;

    const allStylesheets = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));

    const editorStylesheet = allStylesheets.find(link => editorRegex.test(link.href));

    if (!editorStylesheet) {
        return false;
    }

    const replacedEditorStylesheet = editorStylesheet.href.replace(/\/editor$/, '/all');

    const linkAlreadyExists = allStylesheets.some(l => l && l.href === replacedEditorStylesheet);
    if (linkAlreadyExists) {
        return false;
    }

    const newLink = doc.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = replacedEditorStylesheet;
    doc.head.appendChild(newLink);
    return true;
};

/**
 * Copy the theme styles.php links from parent into editor.
 * @param {Object} editor
 * @returns {boolean}
 */
const handleThemeDesignerMode = (editor) => {

    const editorDoc = editor.getDoc();
    const parentDoc = editor.getWin?.().parent?.document;

    const editorStylesheet = Array.from(
        editorDoc.querySelectorAll('link[rel="stylesheet"]')
    );

    const allStylesheets = Array.from(
        parentDoc.querySelectorAll('link[rel="stylesheet"]')
    );

    const existingHrefs = new Set(
        editorStylesheet.map(link => link.href)
    );

    let stylesheetadded = false;

    allStylesheets.forEach(stylesheet => {
        const href = stylesheet.href;

        if (!href.includes('/theme/styles')) {
            return;
        }

        if (existingHrefs.has(href)) {
            return;
        }

        const newLink = editorDoc.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = href;
        editorDoc.head.appendChild(newLink);

        existingHrefs.add(href);

        stylesheetadded = true;
    });

    return stylesheetadded;
};

/**
 * Injects theme-specific CSS into the provided editor instance.
 *
 * This function retrieves the document object from the editor and performs the following:
 * - Attempts to handle CSS injection for normal mode.
 * - If normal mode is successfully handled, the process is terminated.
 * - If normal mode is not handled, the function proceeds to handle the theme designer mode.
 *
 * @param {Object} editor - The editor instance where the theme CSS will be injected.
 */
const injectThemeCss = (editor) => {

    const normalModeHandeled = handleNormalMode(editor);
    if (normalModeHandeled) {
        return;
    }

    handleThemeDesignerMode(editor);
};


/**
 * Setup the tiny_injectcss Plugin.
 */
export default new Promise((resolve) => {
    // Note: The PluginManager.add function does not support asynchronous configuration.
    // Perform any asynchronous configuration here, and then call the PluginManager.add function.
    Promise.all([
        getTinyMCE(),
        getPluginMetadata(component, pluginName),
    ]).then(([tinyMCE, pluginMetadata]) => {
        tinyMCE.PluginManager.add(pluginName, (editor) => {

            // Inject ALL CSS once Tiny is initialized.
            editor.on('init', () => {
                injectThemeCss(editor);
            });

            return pluginMetadata;
        });
        resolve([pluginName]);
        return pluginMetadata;
    }).catch((error) => {
        window.console.error("Error during plugin setup:", error);
        resolve([pluginName]);
    });
});
