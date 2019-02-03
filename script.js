maps = {
    Unique : ["Acton's Nightmare","Caer Blaidd, Wolfpack's Den","Death and Taxes","Doryani's Machinarium","Hall of Grandmasters","Hallowed Ground","Maelström of Chaos","Mao Kun","Oba's Cursed Trove","Olmec's Sanctum","Pillars of Arun","Poorjoy's Asylum","The Beachhead","The Coward's Trial","The Perandus Manor","The Putrid Cloister","The Twilight Temple","The Vinktar Square","Untainted Paradise","Vaults of Atziri","Whakawairua Tuahu"],
    Tier1  : ["Channel Map","Flooded Mine Map","Ramparts Map","Arid Lake Map"],
    Tier2  : ["Armoury Map","Dungeon Map","Iceberg Map","Pen Map","Thicket Map"],
    Tier3  : ["Bone Crypt Map","Cage Map","Cursed Crypt Map","Desert Map","Excavation Map","Fungal Hollow Map","Graveyard Map","Grotto Map","Peninsula Map","Shipyard Map"],
    Tier4  : ["Barrows Map","Beach Map","Courtyard Map","Crater Map","Glacier Map","Lighthouse Map","Lookout Map","Marshes Map","Spider Lair Map","Strand Map"],
    Tier5  : ["Alleyways Map","City Square Map","Gardens Map","Jungle Valley Map","Mausoleum Map","Maze Map","Port Map","Residence Map","Underground Sea Map","Vaal Pyramid Map"],
    Tier6  : ["Academy Map","Ashen Wood Map","Canyon Map","Fields Map","Haunted Mansion Map","Phantasmagoria Map","Precinct Map","Sulphur Vents Map","Temple Map","Volcano Map","Wharf Map"],
    Tier7  : ["Arcade Map","Bazaar Map","Cells Map","Conservatory Map","Dunes Map","Geode Map","Ghetto Map","Lava Chamber Map","Primordial Pool Map","Toxic Sewer Map","Underground River Map"],
    Tier8  : ["Arachnid Nest Map","Infested Valley Map","Laboratory Map","Mineral Pools Map","Mud Geyser Map","Orchard Map","Overgrown Ruin Map","Promenade Map","Sepulchre Map","Shore Map","Wasteland Map"],
    Tier9  : ["Ancient City Map","Arena Map","Cemetery Map","Moon Temple Map","Museum Map","Relic Chambers Map","Scriptorium Map","Tropical Island Map","Vault Map","Waste Pool Map","Waterways Map"],
    Tier10 : ["Belfry Map","Coral Ruins Map","Coves Map","Estuary Map","Leyline Map","Pier Map","Pit Map","Plateau Map","Plaza Map","Spider Forest Map"],
    Tier11 : ["Arachnid Tomb Map","Bog Map","Burial Chambers Map","Chateau Map","Crystal Ore Map","Factory Map","Lair Map","Mesa Map","Park Map","Siege Map"],
    Tier12 : ["Arsenal Map","Castle Ruins Map","Colonnade Map","Defiled Cathedral Map","Ivory Temple Map","Malformation Map","Necropolis Map","Overgrown Shrine Map","Villa Map"],
    Tier13 : ["Acid Caverns Map","Caldera Map","Colosseum Map","Core Map","Crimson Temple Map","Dig Map","Racecourse Map","Reef Map","Shrine Map"],
    Tier14 : ["Basilica Map","Carcass Map","Courthouse Map","Dark Forest Map","Palace Map","Sunken City Map","Terrace Map"],
    Tier15 : ["Desert Spring Map","Lava Lake Map","Primordial Blocks Map","Summit Map","Tower Map"],
    Tier16 : ["Forge of the Phoenix Map","Lair of the Hydra Map","Maze of the Minotaur Map","Pit of the Chimera Map","Vaal Temple Map"]
}

completedMaps = {};

var totalNumberOfMaps = 0;
var numberOfCompletedMaps = 0;

function toggleChevron(e) {
    $(e.target).parent().find(".panel-title .glyphicon")
        .toggleClass("glyphicon-chevron-down glyphicon-chevron-right");
}

$(document).ready(function() {
    $("#mapSelector").on('hidden.bs.collapse', toggleChevron);
    $("#mapSelector").on('shown.bs.collapse', toggleChevron);
    $("#resetButton").on('click', function(e) {
        e.preventDefault();
        $('#confirm').modal({ backdrop: 'static', keyboard: false })
            .one('click', '#delete', function() {
                resetData();
        });
    });

    generateMapSelector();

    $.each(maps, function(i, val) {
        completedMaps[i] = [];
        totalNumberOfMaps += val.length;
    });

    loadFromLocalStorage();
    displayMissingMaps();
});

function saveToLocalStorage() {
    localStorage.setItem("data", JSON.stringify(completedMaps));
}

function loadFromLocalStorage() {
    var loadedData = JSON.parse(localStorage.getItem("data"));
    if (loadedData !== null) {
        $.each(loadedData, function(i, val) {
            $.each(val, function() {
                setMapAsComplete(i, this);
            });
        });
        completedMaps = loadedData;
    }
}

function resetData() {
    $.each(maps, function(i, val) {
        completedMaps[i] = [];
    });
    numberOfCompletedMaps = 0;
    saveToLocalStorage();

    location.reload();
}

function toggleMapCompletion(category, name) {
    var index = completedMaps[category].indexOf(name);
    if (index < 0) {
        setMapAsComplete(category, name);
    } else {
        setMapAsNotComplete(category, name);
    }
}

function setMapAsNotComplete(category, name) {
    var index = completedMaps[category].indexOf(name);
    if (index > -1) {
        $("#" + name).find("span").toggleClass("glyphicon-ok glyphicon-remove");
        $("#" + name).find("a").css("color", "");
        numberOfCompletedMaps--;
        completedMaps[category].splice(index, 1);

        displayMissingMaps();
        updateProgressBar();
        saveToLocalStorage();
    }
}

function setMapAsComplete(category, name) {
    var index = completedMaps[category].indexOf(name);
    if (index < 0) {
        $("#" + name).find("span").toggleClass("glyphicon-ok glyphicon-remove");
        $("#" + name).find("a").css("color", "#0A0");
        numberOfCompletedMaps++;
        completedMaps[category].push(name);

        displayMissingMaps();
        updateProgressBar();
        saveToLocalStorage();
    }
}

function setCategoryComplete(category) {
    $(maps[category]).each(function() {
        setMapAsComplete(category, this.toString().replace(/'|,/g, ""));
    });
}

function setCategoryNotComplete(category) {
    $(maps[category]).each(function() {
        setMapAsNotComplete(category, this.toString().replace(/'|,/g, ""));
    });
}

function updateProgressBar() {
    var percentage = 100 * numberOfCompletedMaps / totalNumberOfMaps;
    $("#progress-bar").css("width", percentage+"%").attr("aria-valuenow", numberOfCompletedMaps);
    $("#progress-bar").html(numberOfCompletedMaps.toString() + " / " + totalNumberOfMaps.toString());
}

function displayMissingMaps() {
    var overview = "";
    $.each(maps, function(category, val) {
        var missing = val.filter(function(el) {
            if (completedMaps[category] === undefined) return true;
            return completedMaps[category].indexOf(el.replace(/'|,/g, "")) < 0;
        });
        if (missing.length !== 0) {
            overview += category.replace(/Tier/g, "Tier ") + ": ";
            for (var i = 0; i < missing.length; i++) {
                overview += "<a href=\"http://pathofexile.gamepedia.com/";
                overview += missing[i];
                if (category !== "Unique") {
                    overview += "_Map"
                }
                overview += "\">" + missing[i].replace(/_/g, " ");
                overview += "</a>";
                if (i != missing.length - 1) {
                    overview += ", ";
                }
            }
            overview += "<br>";
        } else {
            $("#collapse" + category).collapse("hide");
        }
    });
    $("#overviewBody").html(overview);
}

function generateMapSelector() {
    $("#mapSelector").append("<h3>Select completed maps</h3>");
    $("#mapSelector").append("<strong>Click map names to toggle which ones you have completed.</strong>");
    $("#mapSelector").append("<div class=\"panel-group\" id=\"panels\">");

    $.each(maps, function(i, val) {
        $("#panels").append("<div class=\"panel panel-default\" id=\"" + i + "\">");
        $("#" + i).append(" \
        <div class=\"panel-heading\"> \
            <h4 class=\"panel-title\"> \
                <a data-toggle=\"collapse\" href=\"#collapse" + i + "\"> \
                    <strong>" + i.replace(/Tier/g, "Tier ") + "</strong> \
                    <span class=\"glyphicon glyphicon-chevron-down\"></span> \
                </a> \
            </h4> \
        </div> \
        ");

        $("#" + i).append(" \
        <div id=\"collapse" + i + "\" class=\"panel-collapse collapse in\"> \
            <div class=\"panel-body\"> \
                <div class=\"row\" id=\"" + i + "control\" style=\"margin-bottom:15px\"> \
                    <div style=\"padding:5px\"> \
                        <button type=\"button\" style=\"margin-right:10px;\" class=\"btn btn-default\" \
                            onclick=\"setCategoryComplete('" + i + "')\"> \
                            <span class=\"glyphicon glyphicon-ok\"></span> \
                            Mark all maps of this category as completed \
                        </a> \
                        <button type=\"button\" class=\"btn btn-default\" \
                            onclick=\"setCategoryNotComplete('" + i + "')\"> \
                            <span class=\"glyphicon glyphicon-remove\"></span> \
                            Mark all maps of this category as not completed  \
                        </a> \
                    </div> \
                </div> \
                <div class=\"row\" id=\"" + i + "maps\"> \
        ");

        $.each(val, function() {
            $("#" + i + "maps").append(" \
            <div id=\"" + this.replace(/'|,/g, "")
                + "\" style=\"word-wrap:break-word; padding:10px; \
                margin-bottom:7px; margin-top:7px; float:left;\"> \
                <a href=\"#/\" role=\"button\" onclick=\"toggleMapCompletion('" + i + "', '" +
                    this.replace(/'|,/g, "") + "')\" style=\"display:block;\"> \
                    <span class=\"glyphicon glyphicon-remove\"></span> \
                    " + this.replace(/_/g, " ") + " \
                </a> \
            </div> \
            ");
        });
    });

    $("#mapSelector").append("</div>");
}
