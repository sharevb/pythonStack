/*!
 * pythonStack v1.0.0
 * A simple and easy library for highlighting Java stack traces
 * License: Apache 2
 * Author: ShareVB
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.pythonStack = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function pythonStack(element, options) {
        // Default settings
        var settings = Object.assign({
            intro: 'st-intro',
            exception: 'st-exception',
            method: 'st-methodName',
            file: 'st-fileName',
            line: 'st-lineNumber',
			prettyprint: true,
        }, options);

        var atLineModel = /^\s*File\s+&quot;([^)]+)&quot;,\s+line\s+(\d+),\s+in\s+(.+)$/i;

        var stacktrace = escapeHtml(element.textContent);
		if (settings.prettyprint){
			stacktrace = stacktrace.replace(/\s+File\s"/g, '\n  File "');
		}
        var lines = stacktrace.split('\n'),
            stack = '',
            parts,
            elementObj;

        function template_line(line, element) {
            line = line
				.replace('File &quot;' + element.file + '&quot;,', 'File &quot;<span class="'+ settings.file +'">' + element.file + '</span>&quot;,')
                .replace(', line ' + element.lineNumber + ',', ', line <span class="'+ settings.line +'">' + element.lineNumber + '</span>,')
				.replace(' in ' + element.methodName, ' in <span class="'+ settings.method +'">' + element.methodName + '</span>');
            line = line.replace(/&lt;/g, '<span>&lt;</span>').replace(/&gt;/g, '<span>&gt;</span>');

            return line;
        }

        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        for (var i = 0, j = lines.length; i < j; ++i) {
            var line = '';

            if ((/Traceback \(most recent call last\):/.exec(lines[i]))) {
                line = '<span class="' + settings.intro + '">' + lines[i] + '</span>';			
            } else if ((parts = /^([^:\s]+): (.+)$/.exec(lines[i]))) {
                line = '<span class="' + settings.exception + '">' + parts[1] + '</span>: ' + parts[2];			
            } else if ((parts = atLineModel.exec(lines[i]))) {
                elementObj = {
                    'file': parts[1],
                    'methodName': parts[3],
                    'lineNumber': +parts[2],
                };
                line = template_line(lines[i], elementObj);
            } else {
                line = lines[i].replace(/&lt;/g, '<span>&lt;</span>').replace(/&gt;/g, '<span>&gt;</span>');
            }

            if (lines.length - 1 == i) {
                stack += line;
            } else {
                stack += line + '\n';
            }
        }

        element.innerHTML = stack;
    }

    // Function to initialize the plugin on elements
    function initpythonStack(elements, options) {
        elements.forEach(function(element) {
            pythonStack(element, options);
        });
    }

    // Expose the plugin globally
    function pythonStackLibrary(selector, options) {
        var elements = document.querySelectorAll(selector);
        initpythonStack(Array.from(elements), options);
    }

    return pythonStackLibrary;

}));