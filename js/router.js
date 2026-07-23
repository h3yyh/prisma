const projectName = "prisma";

export const BASE_PATH =
    location.hostname.endsWith("github.io")
        ? `/${projectName}`
        : "";

const routes = new Map();

function normalizePath(path){
    let normalized = path || "/";

    if(BASE_PATH && normalized.startsWith(BASE_PATH)){
        normalized = normalized.slice(BASE_PATH.length);
    }

    if(!normalized.startsWith("/")){
        normalized = `/${normalized}`;
    }

    if(normalized.length > 1){
        normalized = normalized.replace(/\/+$/,"");
    }

    return normalized || "/";
}

export function registerRoute(path,render){
    routes.set(normalizePath(path),render);
}

export function createURL(path){
    const normalized = normalizePath(path);

    return normalized === "/"
        ? `${BASE_PATH}/`
        : `${BASE_PATH}${normalized}`;
}

export function navigate(path,{replace=false}={}){
    history[replace ? "replaceState" : "pushState"](
        {},
        "",
        createURL(path)
    );

    renderCurrentRoute();
}

export function renderCurrentRoute(){
    const path = normalizePath(location.pathname);
    const render = routes.get(path) || routes.get("/404");

    render?.({path,navigate});
}

export function startRouter(){
    document.addEventListener("click",event => {
        const link = event.target.closest("[data-route]");

        if(
            !link ||
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ){
            return;
        }

        event.preventDefault();
        navigate(link.dataset.route);
    });

    window.addEventListener("popstate",renderCurrentRoute);
    renderCurrentRoute();
}
