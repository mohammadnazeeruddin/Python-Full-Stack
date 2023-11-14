// TRANSLATION
// -----------------------------------
import Storages from 'js-storage';

function initTranslation() {

    var preferredLang = 'en';
    var storageKey = 'jq-appLang';

    // detect saved language or use default
    var currLang = Storages.localStorage.get(storageKey) || preferredLang;

    // Set initial language
    setLanguage(currLang);

    document.addEventListener('click', function(e) {
        var elem = e.target;
        var selLang = elem.getAttribute('data-set-lang');
        if (selLang) {
            setLanguage(selLang);
            activateDropdown(elem);
        }
    })

    function setLanguage(lang) {
        TAPi18n.setLanguage(lang);
        Storages.localStorage.set(storageKey, lang);
    }

    // Set the current clicked text as the active dropdown text
    function activateDropdown(item) {
        if (item.classList.contains('dropdown-item')) {
            item.parentElement.previousElementSibling.innerHTML = item.innerHTML;
        }
    }

} //initTranslation

export default initTranslation