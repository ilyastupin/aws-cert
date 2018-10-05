'use strict';

const CDP = require('chrome-remote-interface');
const logger = require('./logger.js')
var Promise=require('bluebird');


let client, DOM, Emulation, Network, Page, Runtime, Input;
const viewportWidth =  1440;
const viewportHeight = 900;
const deviceMetrics = {
   width: viewportWidth,
   height: viewportHeight,
   deviceScaleFactor: 0,
   mobile: false,
   fitWindow: false,
};

const timeout = ms => new Promise(res => setTimeout(res, ms));

async function init() {
   logger.info("init started");
   client = await CDP();
   DOM = client.DOM;
   Emulation = client.Emulation;
   Network = client.Network;
   Page = client.Page;
   Runtime = client.Runtime;
   Input = client.Input;
   Network.setUserAgentOverride({'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36'});
   await Page.enable();
   await DOM.enable();
   await Network.enable(); 
   await Emulation.setDeviceMetricsOverride(deviceMetrics);
   await Emulation.setVisibleSize({width: viewportWidth, height: viewportHeight});
   logger.info("init completed");
}

async function navigate(url) {
   logger.info("navigate started");
   await Page.navigate({url:url});      
   logger.info("navigate completed");
}

async function wait_for_selector(selector,attempts){
    //await doscreenshot();
    logger.info("wait_for_selector:");
    logger.info("   "+selector);
    const ishidden="function isHidden(el) {var style = window.getComputedStyle(el);return (style.display === 'none')};";
    if (attempts==null) attempts=100;
    let succeed=false;
    do{
        attempts--;
        logger.info("await evaluate...attepmts left="+attempts);
        const {result:result} = await evaluate(ishidden+'isHidden(document.querySelector("'+selector+'"));');
        logger.info("await evaluate...ok result="+JSON.stringify(result));
        if ((result.type==='boolean')&&(!result.value)) {
           succeed=true;
           logger.info("wait_for_selector:ok");
           //await doscreenshot();
           break;
        }
        logger.info("waiting 300ms...");
        await timeout(300);
        logger.info("waiting 300ms...ok");
    } while (attempts>0);
    if (!succeed) {
        logger.info("wait_for_selector:failed!");
        //await doscreenshot();
        }
    return succeed;
}

async function wait_for_selector_value(selector,value,attempts,secret){
    //await doscreenshot();
    logger.info("wait_for_selector_value:");
    logger.info("   "+selector);
    if (secret==null) logger.info("   "+value);
    if (attempts==null) attempts=100;
    let succeed=false;
    do{
        attempts--;
        const {result:result} = await evaluate('document.querySelector("'+selector+'").value;');
        if (result.value===value) {
           succeed=true;
           logger.info("wait_for_selector_value:ok");
           //await doscreenshot();
           break;
        }
        await timeout(100);
    } while (attempts>0);
    if (!succeed) {
        logger.info("wait_for_selector_value:failed!");
        //await doscreenshot();
        }
    return succeed;
}

async function wait_for_selector_value_secret(selector,value,attempts){
   return await wait_for_selector_value(selector,value,attempts,true);
}

async function wait_for_selector_text_changed(selector,text,attempts){
    //await doscreenshot();
    logger.info("wait_for_selector_text_changed:");
    logger.info("   "+selector);
    logger.info("   "+text);
    if (attempts==null) attempts=100;
    let succeed=false;
    do{
        attempts--;
        const {result:result} = await evaluate('document.querySelector("'+selector+'").innerText;');
        if ((result.type==='string')&&(result.value!==text)) {
           succeed=true;
           logger.info("wait_for_selector_text_changed:ok "+result.value);
           //await doscreenshot();
           break;
        }
        await timeout(100);
    } while (attempts>0);
    if (!succeed) {
        logger.info("wait_for_selector_text_changed:failed!");
        //await doscreenshot();
        }
    return succeed;
}

async function wait_for_selector_text(selector,text,attempts){
    //await doscreenshot();
    logger.info("wait_for_selector_text:");
    logger.info("   "+selector);
    logger.info("   "+text);
    if (attempts==null) attempts=100;
    let succeed=false;
    do{
        attempts--;
        const {result:result} = await evaluate('document.querySelector("'+selector+'").innerText;');
        if ((result.type==='string')&&(result.value===text)) {
           succeed=true;
           logger.info("wait_for_selector_text:ok");
           //await doscreenshot();
           break;
        }
        await timeout(100);
    } while (attempts>0);
    if (!succeed) {
        logger.info("wait_for_selector_text:failed!");
        //await doscreenshot();
        }
    return succeed;
}

async function click(selector){
   if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
   await evaluate('document.querySelector("'+selector+'").click()');
}

async function focus(selector){
   if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
   await evaluate('document.querySelector("'+selector+'").focus()');
}

async function set_str_value(selector,value){
   if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
   await evaluate('document.querySelector("'+selector+'").value="'+value+'";');
}

async function get_value(selector){
   if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
   return (await evaluate('document.querySelector("'+selector+'").value')).result.value;
}

async function get_text(selector){
   if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
   return (await evaluate('document.querySelector("'+selector+'").innerText')).result.value;
}

async function touch_text(selector){
   var text = await get_value(selector);
   logger.info("text='"+text+"'");
   
   await focus(selector);
   await Input.dispatchKeyEvent({ type: 'char', text: 'a' }); 
   if (!await wait_for_selector_value(selector,text+"a"))  await Input.dispatchKeyEvent({ type: 'char', text: 'a' }); 
   if (!await wait_for_selector_value(selector,text+"a")) return exit("Error: wait_for_selector_value");
   await Input.dispatchKeyEvent({ type: 'rawKeyDown', windowsVirtualKeyCode: 8 })
   if (!await wait_for_selector_value(selector,text)) return exit("Error: wait_for_selector_value");
}


function runtime_wrapper(code) {
   return 'try {eval(`' + code + '`)} catch (e) {e.toString()}'
}

async function get_classname(selector){
   if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
   return (await evaluate('document.querySelector("'+selector+'").className')).result.value;
}

async function changevalue(selector,value){
   if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
   await evaluate('var el=document.querySelector("'+selector+'");el.value="'+value+'";event = document.createEvent("HTMLEvents");'+
      'event.initEvent("input", true, true);event.eventName = "input";el.dispatchEvent(event);');
}

async function evaluate(expression){
   return (await Runtime.evaluate({expression: runtime_wrapper(expression)}));
}



function done() {
   client.close();
}


async function get_elements_with_positions(selector) {
   const snippet = `
      function allDescendants (node) {
         for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            allDescendants(child);
            if ((child.nodeName === "#text")&&(child.parentNode.innerText!=="")){ 
               var rect=child.parentNode.getBoundingClientRect();
               result.push({text:child.parentNode.innerText, rect:rect});
            }
         }
      };
      var result=[];
      var el=document.querySelector("${selector}");
      allDescendants(el);
      JSON.stringify(result,null,4);
      `
   if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
   return (await evaluate(snippet)).result.value;
}


async function get_urls_texts_inside_element(selector) {
   const snippet = `
   var result=[];
   var els=document.querySelector("${selector}").getElementsByTagName("A");
   for (i=0; i < els.length-1; i++) {
      var el = els[i];
      result.push({href:el.href, text:el.innerText});
   }
   JSON.stringify(result,null,4);
   ` 
   if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
   return (await evaluate(snippet)).result.value;
}

module.exports = {
   init: init,
   navigate: navigate,
   wait_for_selector: wait_for_selector,
   wait_for_selector_value: wait_for_selector_value,
   wait_for_selector_value_secret: wait_for_selector_value_secret,
   wait_for_selector_text_changed: wait_for_selector_text_changed,
   wait_for_selector_text: wait_for_selector_text,
   click: click,
   focus: focus,
   set_str_value: set_str_value,
   get_value: get_value,
   get_text: get_text,
   touch_text: touch_text,
   get_classname: get_classname,
   changevalue: changevalue,
   evaluate: evaluate,
   execute: evaluate,
   get_elements_with_positions: get_elements_with_positions,
   get_urls_texts_inside_element: get_urls_texts_inside_element,
   done: done
};

