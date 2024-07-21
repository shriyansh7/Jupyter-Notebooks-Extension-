define([
    'base/js/namespace',
    'base/js/events'
], function(Jupyter, events) {
    // Function to add a default cell
    var add_cell = function() {
        Jupyter.notebook.
        insert_cell_above('code').
        set_text(`# Standard data science libraries
import pandas as pd
import numpy as np
from scipy import stats
import featuretools as ft
# Visualization
import matplotlib.pyplot as plt
import seaborn as sns
plt.style.use('bmh')
# Options for pandas
pd.options.display.max_columns = 20
# Display all cell outputs
from IPython.core.interactiveshell import InteractiveShell
InteractiveShell.ast_node_interactivity = 'all'
`);
        Jupyter.notebook.select_prev();
        Jupyter.notebook.execute_cell_and_select_below();
    };

    // Function to create the default cell button
    var defaultCellButton = function () {
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                'help': 'Add default cell',
                'icon' : 'fa-play-circle',
                'handler': add_cell
            }, 'add-default-cell', 'Default cell')
        ])
    }

    // Function to create the timer button
    function createTimerButton() {
        var button = $('<button/>')
            .addClass('btn btn-sm navbar-btn')
            .attr('id', 'code-timer-button')
            .text('Time Code')
            .click(timeSelectedCells);
        
        $('#maintoolbar-container').append(button);
    }

    // Function to time the execution of selected cells
    function timeSelectedCells() {
        var selectedCells = Jupyter.notebook.get_selected_cells();
        if (selectedCells.length === 0) {
            alert('Please select one or more cells to time.');
            return;
        }

        var totalStartTime = performance.now();

        selectedCells.forEach(function(cell, index) {
            var startTime = performance.now();
            
            cell.execute().then(function() {
                var endTime = performance.now();
                var executionTime = endTime - startTime;
                
                // Display time for each cell
                var output = $('<div/>').addClass('output_area')
                    .html('Cell ' + (index + 1) + ' execution time: ' + executionTime.toFixed(2) + ' ms');
                cell.output_area.append_output({output_type: 'display_data', data: {'text/html': output.prop('outerHTML')}});
                
                // If this is the last cell, display total time
                if (index === selectedCells.length - 1) {
                    var totalEndTime = performance.now();
                    var totalExecutionTime = totalEndTime - totalStartTime;
                    var totalOutput = $('<div/>').addClass('output_area')
                        .html('<strong>Total execution time: ' + totalExecutionTime.toFixed(2) + ' ms</strong>');
                    cell.output_area.append_output({output_type: 'display_data', data: {'text/html': totalOutput.prop('outerHTML')}});
                }
            });
        });
    }

    // Function to load the extension
    function load_ipython_extension() {
        // Add a default cell if there are no cells
        if (Jupyter.notebook.get_cells().length === 1){
            add_cell();
        }
        defaultCellButton();
        createTimerButton();
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
