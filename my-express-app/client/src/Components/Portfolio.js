import React, { useEffect, useState } from "react";
import PopUp from "./PopUp";
import "./Portfolio.css";

export default function Portfolio(props) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [featured, setFeatured] = useState(null);
    const [folders, setFolders] = useState([]);
    const [folder, setFolder] = useState("");
    const [currentFolder, setCurrentFolder] = useState(1);

    useEffect(() => {
        fetch("/folders/mvp")
        .then(result => result.json())
        .then(folders => { setFolders(folders) })
        .catch(error => { console.log(error) })
    }, [folder]);

    const filterNPCS = (npcs, search) => {
        if(!search) { return npcs }
        return npcs.filter((npc) => {
            const name = npc.firstname.toLowerCase() + npc.lastname.toLowerCase();
            return name.includes(search);
        })
    };

    const filteredNPCS = filterNPCS(props.npcs, search);

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    const addFolder = (folder) => {
        fetch("/folders/mvp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ folder: folder, image: "http://www.newdesignfile.com/postpic/2013/12/transparent-folder-icon_247505.png" })
          })
            .then(result => result.json())
            .then(folders => {
              setFolders(folders)
            })
            .catch(error => { console.log(error.message) })
    }

    const updateFolder = (folder, id) => {
        // console.log(folder, id)
        fetch(`/folders/mvp/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({folder})
        })
        .then(result => result.json())
        .then(folders => { setFolders(folders) })
        .catch(error => { console.log(error) })
        setFolder("")
    }

    const handleDelete = (id) => {
        props.onDelete(id);
    }

    const addFolderID = (npcID, folderID) => {
        props.onFolder(npcID, folderID);
    }

    const openPopup = (id) => {
        setIsOpen(true);
        const index = props.npcs.findIndex(n => n.id === id)
        setFeatured(props.npcs[index]);
    }

    const closePopup = () => {
        setIsOpen(false);
    }

    const updateNPC = (updatedNPC) => {
        props.updateNPC(updatedNPC);
        setFeatured(updatedNPC);
    }

    return (
    <div className="wrap">
        <div className="search-bar">
            <span className="folder">create folder
                <button type="button" className="btn" onClick={() => addFolder("folder")} >
                    <i class="gg-folder-add"></i>
                </button>
            </span>
            <span>search:</span>
            <input
            type="text"
            name="search"
            value={search}
            onChange={handleChange} />
        </div>

        <div className="tab-content">
            {currentFolder !== 1 ?
            <div>
                <div className="back-btn">
                    <button type="button" className="btn" onClick={() => setCurrentFolder(1)}>
                        <i class="gg-arrow-left"></i>
                        go back
                    </button>
                </div>
                <div className="fold-title">
                    <h4>{folders[folders.findIndex(f => f.id == currentFolder)].folder.toUpperCase()}</h4>
                </div>
            </div>
            : <div className="fold-title">
                <h4>{props.games[props.games.findIndex(g => g.id === props.currentGame)].game.toUpperCase()}</h4>    
            </div>}
            <ul className="tiles">
                {props.npcs &&
                filteredNPCS.filter(n => n.game_id === props.currentGame).filter(n => n.folder_id === currentFolder).map(n => (
                    <li key={n.id} className="mod-tile">
                        <div className="dropdown" id="droptile">
                            <button className="dropbtn" type="button" id="tile-btn"> + </button>
                            <div className="dropdown-content" id="drop-content">
                                {/* TODO */}
                                <a className="dropdown-item" id="fave">Favourite
                                    <img 
                                    id="star-icon"
                                    src="https://2.bp.blogspot.com/-hsuemZmkYBo/WJibJn2XtFI/AAAAAAAAAEc/zNVuRLIoq4o_WV6QMMOqx-gOfmbsFXYJgCLcB/s1600/star-icon.png"
                                    alt="icon of a yellow star"
                                    />
                                </a>
                                <a className="dropdown-item" id="kill">Kill
                                    <img 
                                    id="kill-icon"
                                    src="https://cdn3.iconfinder.com/data/icons/video-game-items-concepts/128/skull-2-512.png"
                                    alt="icon of a skull"
                                    />
                                </a>
                                <a className="dropdown-item dropdown" id="send-drop">
                                    <button type="button" className="btn">
                                    Send to...
                                    </button>
                                    <div className="dropdown-content" id="send-content">
                                        {folders && folders.filter(f => f.id !== 1).map((f) => (
                                            <a className="dropdown-item" key={f.id} onClick={() => addFolderID(n.id, f.id)}>{f.folder}</a>
                                        ))}
                                        {currentFolder !== 1 ? 
                                        <a className="dropdown-item" onClick={() => addFolderID(n.id, 1)}>Portfolio</a>
                                    : <div id="hiding"></div>}
                                    </div>
                                </a>
                                <a className="dropdown-item btn-outline-danger" id="delete-btn" onClick={() => handleDelete(n.id)}>Delete</a>
                            </div>
                        </div>
                        <div className="mod-image">
                            <img src={n.image} alt="description of the character" onClick={() => openPopup(n.id)}/>
                        </div>
                        <div className="tile-content">
                            <p>{n.firstname} {n.lastname}</p>
                        </div>
                    </li>
                ))}
                {currentFolder === 1 &&
                folders.filter(f => f.id !== 1).map(f => (
                    <li key={f.id} className="mod-tile">
                        <div className="mod-image">
                            <img src={f.image} alt="new folder" onClick={() => setCurrentFolder(f.id)}/>
                        </div>
                        {f.folder === "folder" ? 
                        <div className="tile-content">
                            <form className="input-content">
                                <input 
                                type="text" 
                                placeholder="new folder"
                                name="folder"
                                value={folder}
                                onChange={e => setFolder(e.target.value)}
                                id="folder-input" 
                                />
                                <button type="button" onClick={() => updateFolder(folder, f.id)}>
                                    <i class="gg-check"></i>
                                </button>
                            </form>
                        </div>
                        : 
                        <div>
                            <p>{f.folder}</p>
                        </div>}
                    </li>
                ))}
            </ul>
            {isOpen && <PopUp handleClose={closePopup} npc={featured} updateNPC={(updatedNPC) => updateNPC(updatedNPC)} />}
        </div>
    </div>
    )
}