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
 * Injects theme-specific CSS into the provided editor instance.
 *
 * @param {Object} editor
 * @returns {boolean}
 */
const injectThemeCss = (editor) => {

    const editorBody = editor.getBody();
    const editorDoc = editor.getDoc();
    const parentDoc = window.document;

    if (!editorDoc || !editorBody || !parentDoc) {
        return false;
    }

    const parentBody = parentDoc.body;

    if (!parentBody) {
        return false;
    }

    const editorStylesheets = Array.from(
        editorDoc.querySelectorAll('link[rel="stylesheet"]')
    );

    const allStylesheets = Array.from(
        parentDoc.querySelectorAll('link[rel="stylesheet"]')
    );

    const existingHrefs = new Set(
        editorStylesheets.map(link => link.href)
    );

    let stylesheetadded = false;

    allStylesheets.forEach(stylesheet => {

        const href = stylesheet.href;

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

    const editorStylesheet = Array.from(
        editorDoc.querySelectorAll('link[rel="stylesheet"]')
    ).filter(link => link.href.endsWith('/editor'));

    editorStylesheet.forEach(link => link.remove());

    return stylesheetadded;
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
