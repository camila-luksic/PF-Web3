import { useState } from "react";
import { Link } from "react-router";
import { URLS } from "../navigation/constants";
import { ChevronDown, List } from "react-bootstrap-icons";
import { useAuth } from "../hooks/useAuth";

export const Menu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const { email, doLogout } = useAuth();
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }
    const toggleSubMenu = (id: string) => {
        const subMenu = document.getElementById(id);
        const shownSubMenus = document.getElementsByClassName("submenu-shown");
        if (shownSubMenus.length > 0) {
            for (let i = 0; i < shownSubMenus.length; i++) {
                const element = shownSubMenus[i] as HTMLElement;
                if (element.id !== id) {
                    element.classList.toggle("hidden");
                    element.classList.toggle("submenu-shown");
                }
            }
        }
        if (subMenu) {
            subMenu.classList.toggle("hidden");
            subMenu.classList.toggle("submenu-shown");
        }
    }
    const onLogoutClick = () => {
        doLogout();
        window.location.href = URLS.LOGIN;
    }
    return (
        <nav className="bg-black shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-white">Sistema de Padron Electoral</span>
                    </div>
                   
                    <div className="flex items-center md:hidden">
                        <button onClick={toggleMenu} id="menu-toggle" className="text-white focus:outline-none cursor-pointer">
                            <List />
                        </button>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to={URLS.HOME} className="text-white hover:text-blue-600">Inicio</Link>
                        <Link to={URLS.PersonasVotantes.BUSCAR} className="text-white hover:text-blue-600">Buscar </Link>
                        <Link to={URLS.SECCIONES} className="text-white hover:text-blue-600">Lista de Secciones</Link>

                        <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('personasVotantes')
                            }} className="cursor-pointer text-white hover:text-blue-600">Personas Votantes<span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="personasVotantes" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <Link to={URLS.PersonasVotantes.LIST} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de personas votantes</Link>
                                <Link to={URLS.PersonasVotantes.CREATE} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Inscribir Persona </Link>
                            </div>
                        </div>
                        <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('elecciones')
                            }} className="cursor-pointer text-white hover:text-blue-600">Elecciones<span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="elecciones" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <Link to={URLS.Elecciones.LIST} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de elecciones</Link>
                                <Link to={URLS.Elecciones.CREATE} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Crear Eleccion</Link>
                            </div>
                        </div>
                         <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('cargos')
                            }} className="cursor-pointer text-white hover:text-blue-600">Cargos <span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="cargos" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <Link to={URLS.Cargos.LIST} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de cargos </Link>
                                <Link to={URLS.Cargos.CREATE} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Inscribir cargo </Link>
                            </div>
                        </div>
                          <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('partidos')
                            }} className="cursor-pointer text-white hover:text-blue-600">Partidos<span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="partidos" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <Link to={URLS.Partidos.LIST} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de partidos </Link>
                                <Link to={URLS.Partidos.CREATE} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Inscribir partido </Link>
                            </div>
                        </div>
                         <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('candidatos')
                            }} className="cursor-pointer text-white hover:text-blue-600">Candidatos<span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="candidatos" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <Link to={URLS.Candidatos.LIST} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de candidatos </Link>
                                <Link to={URLS.Candidatos.CREATE} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Inscribir candidato </Link>
                            </div>
                        </div>
                          <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('recintos')
                            }} className="cursor-pointer text-white hover:text-blue-600">Recintos<span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="recintos" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <Link to={URLS.Recintos.LIST} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de recintos </Link>
                                <Link to={URLS.Recintos.CREATE} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Inscribir recinto </Link>
                            </div>
                        </div>
                        {email && (
    <>
        <div className="hidden md:flex items-center space-x-4">
           
        </div>
        <div className="hidden md:flex items-center space-x-4">
           
        </div>
    </>
)}

                        {email && <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('authMenu')
                            }} className="cursor-pointer text-white hover:text-blue-600">{email}<span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="authMenu" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <button onClick={onLogoutClick} className="cursor-pointer block px-4 py-2 text-gray-800 hover:bg-gray-100 text-start">Cerrar sesión</button>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            <div id="mobile-menu" className={!showMenu ? " hidden " : "" + " md:hidden px-4 pb-4"}>
                <a href="#" className="block text-white py-2">Inicio</a>
            </div>
        </nav>

    );
}