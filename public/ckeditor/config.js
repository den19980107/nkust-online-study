/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [{
			name: 'clipboard',
			groups: ['clipboard', 'undo']
		},
		{
			name: 'editing',
			groups: ['find', 'selection', 'spellchecker']
		},
		{
			name: 'links'
		},
		{
			name: 'insert'
		},
		{
			name: 'forms'
		},
		{
			name: 'tools'
		},
		{
			name: 'document',
			groups: ['mode', 'document', 'doctools']
		},
		{
			name: 'others'
		},
		'/',
		{
			name: 'basicstyles',
			groups: ['basicstyles', 'cleanup']
		},
		{
			name: 'paragraph',
			groups: ['list', 'indent', 'blocks', 'align', 'bidi']
		},
		{
			name: 'styles',
			groups: ['styles', 'fontsize']
		},
		{
			name: 'colors'
		}
	];

	config.extraPlugins = 'imageresizerowandcolumn'
	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.

	// Set the most common block elements.


	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';

};