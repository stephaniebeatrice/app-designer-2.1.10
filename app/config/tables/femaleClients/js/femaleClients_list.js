/**
 * This is the file that will be creating the list view.
 */
/* global $, odkTables, odkData, odkCommon */
/*exported display, handleClick, getResults */
'use strict';

var femaleClients = {};

/** Handles clicking on a list item. Applied via a string. */
function handleClick(index) {
    if (!$.isEmptyObject(femaleClients)) {
        odkTables.openDetailView(null,
            femaleClients.getTableId(),
            index,
            'config/tables/femaleClients/html/femaleClients_detail.html');
    }

}

function cbSRSuccess(searchData) {
    console.log('cbSRSuccess data is' + searchData);
    if(searchData.getCount() > 0) {
        // open filtered list view if client found
        var rowId = searchData.getRowId(0);
        odkTables.openTableToListView(null,
                'femaleClients',
                '_id = ?',
                [rowId],
                'config/tables/FemaleClients/html/femaleClients_list.html');
    } else {
        document.getElementById("search").value = "";
        document.getElementsByName("query")[0].placeholder="Client not found";
    }
}

function cbSRFailure(error) {
    console.log('femaleClients_list: cbSRFailure failed with error: ' + error);
}

// filters list view by client id entered by user
function getResults() {
    var searchText = document.getElementById('search').value;

    odkData.query('femaleClients', 'client_id = ?', [searchText], 
        null, null, null, null, null, null, true, cbSRSuccess, cbSRFailure);
}

// displays list view of clients
function render() {

    // create button that adds enrolled client to the system - launches mini
    // 'add client' form
    var addClient = document.createElement('p');
    addClient.onclick = function() {
        odkTables.addRowWithSurvey(null,
                'femaleClients',
                'addClient',
                null,
                null);
    };
    addClient.setAttribute('class', 'launchForm');
    addClient.innerHTML = 'Add Client';
    document.getElementById('searchBox').appendChild(addClient);

    /* create button that launches graph display */
    var graphView = document.createElement('p');
    graphView.onclick = function() {
        odkTables.openTableToListView(null,
                'femaleClients',
                null,
                null,
                'config/tables/femaleClients/html/graph_view.html');
    };
    graphView.setAttribute('class', 'launchForm');
    graphView.innerHTML = 'Graph View';
    document.getElementById('searchBox').appendChild(graphView);

    for (var i = 0; i < femaleClients.getCount(); i++) {

        var clientId = femaleClients.getData(i, 'client_id');
        var ageEntered = femaleClients.getData(i, 'age');
        var armText = femaleClients.getData(i, 'randomization');

        // make list entry only if client id, age, randomization arm exists
        if (clientId !== null &&
            clientId !== '' &&
            ageEntered !== null &&
            ageEntered !== '' &&
            armText !== null &&
            armText !== '') {
            /*    Creating the item space    */
            var item = document.createElement('li');
            item.setAttribute('class', 'item_space');
            item.setAttribute(
                    'onClick',
                    'handleClick("' + femaleClients.getRowId(i) + '")');
            item.innerHTML = clientId;
            document.getElementById('list').appendChild(item);

            var chevron = document.createElement('img');
            chevron.setAttribute(
                    'src',
                    odkCommon.getFileAsUrl('config/assets/img/little_arrow.png'));
            chevron.setAttribute('class', 'chevron');
            item.appendChild(chevron);

            // create sub-list in item space
            //  Age information
            var age = document.createElement('li');
            age.setAttribute('class', 'detail');
            age.innerHTML = 'Age: ' + ageEntered;
            item.appendChild(age);

            //  Randomization Arm
            var arm = document.createElement('li');
            arm.setAttribute('class', 'detail');
            if(armText === '1') {
                armText = 'HOPE';
            } else if(armText === '2') {
                armText = 'Control';
            }
            arm.innerHTML = 'Randomization: ' + armText;
            item.appendChild(arm);
        }
    }
}

function cbSuccess(result) {
    femaleClients = result;
    render();
}

function cbFailure(error) {
    console.log('femaleClients_list: failed with error: ' + error);
}

function display() {
    odkData.getViewData(cbSuccess, cbFailure);
}
