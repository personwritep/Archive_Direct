// ==UserScript==
// @name        Archive Direct
// @namespace        http://tampermonkey.net/
// @version        0.4
// @description        記事日付から記事一覧内の記事を検索
// @author        Ameba Blog User
// @match        https://ameblo.jp/*
// @exclude        https://ameblo.jp/*/image*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @noframes
// @grant        none
// @updateURL        https://github.com/personwritep/Archive_Direct/raw/main/Archive_Direct.user.js
// @downloadURL        https://github.com/personwritep/Archive_Direct/raw/main/Archive_Direct.user.js
// ==/UserScript==



main();

let target=document.querySelector('head');
let monitor=new MutationObserver(main);
monitor.observe(target, { childList: true });


function main(){
    let path=location.pathname;
    if(document.querySelector('.js-entryWrapper')){ // ブログ・アメンバーの記事画面
        style_in();
        blog_page(); }
    else if(path.includes('/archive')){ // 記事一覧
        style_in();
        blog_archive(); }



    function style_in(){
        let style=
            '<style id="ArchiveD">'+
            '.skin-entryPubdate time, .articleTime time, '+
            '.skin-entryThemes a , .articleTheme a{ '+
            'color: #3970b5; cursor: pointer; }'+
            '.skin-entryPubdate time:hover, .articleTime time:hover, '+
            '.skin-entryThemes a:hover, .articleTheme a:hover { '+
            'color: #000; background: #e3f2fd; text-decoration: none; }'+
            '</style>';

        if(!document.querySelector('#ArchiveD')){
            document.body.insertAdjacentHTML('beforeend', style); }}



    function blog_page(){
        let article=document.querySelector('.js-entryWrapper');
        let user;
        let time=document.querySelector('time');

        if(article && time){
            user=article.getAttribute('data-unique-ameba-id');
            let entry_id=article.getAttribute('data-unique-entry-id');

            let date=time.getAttribute('datetime');
            let entry_ym=date.slice(0, 4) + date.slice(5, 7);

            let path=
                'https://ameblo.jp/'+ user + '/archive-'+ entry_ym +'.html';

            time.addEventListener('click', function(){
                sessionStorage.setItem('ArchiveDirect', entry_id); // 記事ID 🔵
                window.location.href=path; }); }

    } // blog_page()




    function blog_archive(){
        let ac_list={}; // 記事リスト
        let item;
        let item_list

        let entry_id=sessionStorage.getItem('ArchiveDirect'); // 検索記事ID 🔵
        if(entry_id && entry_id!='x'){
            let ac_search=document.querySelector('.skin-borderQuiet');
            if(ac_search){
                item_list=document.querySelector('.skin-archiveList');
                item_list.onload=search_type_new(); } // 新タイプスキン
            else{
                ac_search=document.querySelector('.skinBorderList li');
                if(ac_search){
                    item_list=document.querySelector('.skinBorderList');
                    item_list.onload=search_type_old(); }}} // 旧タイプスキン



        function search_type_new(){
            item=-1;
            ac_list=document.querySelectorAll('.skin-borderQuiet');
            for(let k=0; k<ac_list.length; k++){
                let link=ac_list[k].querySelector('h2 a');
                if(link){
                    let url=link.getAttribute('href');
                    if(url.includes(entry_id)){
                        ac_list[k].style.boxShadow='-6px 0 0 #fff,-25px 0 0 #2196f3';
                        item=k;
                        sessionStorage.setItem('ArchiveDirect', 'x'); // 記事ID 🔵
                        break; }}}


            if(item==-1 && entry_id!='x'){
                let next=document.querySelector('a.skin-paginationNext');
                if(next && next.style.visibility!='hidden'){
                    next.click(); }
                else{ // 記事を発見できなかった場合
                    sessionStorage.setItem('ArchiveDirect', 'x'); // 記事ID 🔵
                }}


            if(item!=-1){
                window.onload=function(){
                    ac_list[item].scrollIntoView({block: "center"}); }}

        } // serch_type_new()



        function search_type_old(){
            item=-1;
            ac_list=document.querySelectorAll('.skinBorderList li');
            for(let k=0; k<ac_list.length; k++){
                let link=ac_list[k].querySelector('h1 a');
                if(link){
                    let url=link.getAttribute('href');
                    if(url.includes(entry_id)){
                        ac_list[k].style.boxShadow='-15px 0 0 #2196f3';
                        item=k;
                        sessionStorage.setItem('ArchiveDirect', 'x'); // 記事ID 🔵
                        break; }}}


            if(item==-1 && entry_id!='x'){
                let next=document.querySelector('a.pagingNext');
                if(next){
                    next.click(); }
                else{ // 記事を発見できなかった場合
                    sessionStorage.setItem('ArchiveDirect', 'x'); // 記事ID 🔵
                }}


            if(item!=-1){
                window.onload=function(){
                    ac_list[item].scrollIntoView({block: "center"}); }}

        } // serch_type_old()

    } // blog_archive()

} // main()

