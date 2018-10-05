const CDP = require('chrome-remote-interface');
const file = require('fs');
var logger = require("./logger.js");
var Promise=require('bluebird');
var cmd=require('node-cmd');
  
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });
 
const format = 'png';
const viewportWidth =  1440;
const viewportHeight = 900;
 
const timeout = ms => new Promise(res => setTimeout(res, ms));
 
var current_screenshot_num=1;
 
const process=require("./process.js");
 
 
 
var raif_url="https://online.raiffeisen.ru/#/login";
var raif_username_value="stupinilya";
var raif_password_value="Anya33!!";
// Screen #1. Enter loging and password
var raif_username_field="body > root-page > div > div > div > login-page > div.login-page__content > login-main-page > div > div.login-page__form > login-form > form > div.login-form__username-wrap > input";
var raif_password_field="body > root-page > div > div > div > login-page > div.login-page__content > login-main-page > div > div.login-page__form > login-form > form > div.login-form__password-wrap > input";
var login_button="body > root-page > div > div > div > login-page > div.login-page__content > login-main-page > div > div.login-page__form > login-form > form > login-form-submit-button > button"
// Screen #2. Balances and other info in dashboard representation
var balance_of_usd_account="#layoutBody > div > transfer-page > favorite-widget > div > div > div.favorite__items.grid > div:nth-child(4) > account-mini-widget > div.mini-widget__thumbnail-wrap > div > div.mini-widget__info > div > div.mini-widget__info-value-wrap > div > amount"
var vypyska_po_schetu_link="#layoutBody > div > transfer-page > favorite-widget > div > div > div.favorite__items.grid > div:nth-child(4) > account-mini-widget > div.mini-widget__transactions.rc-fade-in.ng-star-inserted > div:nth-child(4) > div.mini-widget__transaction-note > a"
// Screen #3. Statement opened as a list
var vsego_rashodov_label="#layoutBody > div > history-page > toggle-widget > div > div.toggle-widget__content > history-page-statement > statement-widget > statement-widget-account > statement-widget-details > div > div:nth-child(1) > div.history-details__label"
var operatsyi_za_ukazanniy_period_ne_naydeno_text="#layoutBody > div > history-page > toggle-widget > div > div.toggle-widget__content > history-page-statement > statement-widget > statement-widget-account > h2"
var za_period_first_date_field="#RcFormControl-10";
var pokazat_esche_button="#layoutBody > div > history-page > toggle-widget > div > div.toggle-widget__content > history-page-statement > statement-widget > statement-widget-account > table > tbody:nth-child(4) > tr > td > pagination > nav > div.pagination__header.ng-star-inserted > button  > span"
var transaction_table="#layoutBody > div > history-page > toggle-widget > div > div.toggle-widget__content > history-page-statement > statement-widget > statement-widget-account > table"
var logout_link="body > root-page > div > div > div > r-page > div > top-sidebar-scroll > top-sidebar > div > div.top-sidebar__header > div.top-sidebar__header-right-side > div.top-sidebar__logout > span"
 
 
var usb_url="https://onlinebanking.usbank.com/Auth/Login";
// Screen #1. Enter login
var usb_username_field="#txtPersonalId";
var usb_continue_button="#btnContinue";
// Screen #2. Security questions
var usb_security_question_label="#customUI > div.authenticator-body.ng-scope > form > label";
var usb_security_answer_field="#ans";
var usb_security_answer_submit_button="#SubmitAns";
// Screen #3 Enter password
var usb_enter_password_label="#customUI > div.authenticator-body.transmit-password.ng-scope > form > div.lw-vs20.lw-placeholderIe8.lw-marginBottom18.lw-floatLeft.lw-passwordScreenHeight > label";
var usb_password_field="#txtPassword";
var usb_login_button="#btnLogin";
// Screen #4. Balances and other info in dashboard representation
var usb_deposit_accounts_information="#DepositAccountsTable";
var usb_checking_account_balance_amount="#DepositAccountsTable > tbody > tr.padded-row.trx_greyArea_odd > td.accountRowLast";
var usb_savings_account_balance_amount="#DepositAccountsTable > tbody > tr.padded-row.trx_whiteArea_even > td.accountRowLast";
var usb_available_credit_amount="#divAvailableCredit3";
var usb_credit_card_current_balance_amount="#CreditsTable > tbody > tr.padded-row.trx_greyArea_odd > td.accountRowLast";
var usb_savings_account_name_link="#DepositAccountsTable > tbody > tr.padded-row.trx_greyArea_odd > td.accountRowFirst > a";
var usb_credit_card_account_name_link="#CreditsTable > tbody > tr.padded-row.trx_greyArea_odd > td.accountRowFirst > a";
// Screen $5. Statement as a list
var usb_transation_table="#TransactionHistoryTable";
var usb_account_balance_amount="#ADSummaryTableDots > tbody > tr:nth-child(1) > td.accountRowFirst > div > span.textRight.ADAccountSummaryBalanceValue";
var usb_available_balance1="#ADSummaryTableDots > tbody > tr.greyRow > td.accountRowFirst > div > span.textRight.ADAccountSummaryBalanceValue";
var usb_available_balance2="#ADSummaryTableDots > tbody > tr:nth-child(3) > td.accountRowFirst > div > span.textRight.ADAccountSummaryBalanceValue";
var usb_credit_card_credit_amount="#ADSummaryTableDots > tbody > tr:nth-child(2) > td.accountRowFirst > div > span.textRight.ADAccountSummaryValueCell.ADAccountSummaryTextBold";
var arrowNext="#arrowNext";
var txtPageNumber="#txtPageNumber";
var usb_logo="#menu-home > div > a";
 
var usb_logout_link="#header-nav > ul > li:nth-child(5) > a";
 
 
 
async function main_routine() {
// Start the Chrome Debugging Protocol
  var client = await CDP();
// Extract used DevTools domains.
  const {DOM, Emulation, Network, Page, Runtime, Input} = client;
 
  Network.setUserAgentOverride({'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36'});
/* It might be useful for the debugging
  Network.requestWillBeSent((params) => {
    console.log("===requestWillBeSent==============================================");
    console.log(params);
  });
 
  Network.responseReceived((params) => {
    console.log("===responseReceived==============================================");
    console.log(params);
  });
*/
 
  async function wait_for_selector(selector,attempts){
      await doscreenshot();
      logger.l("wait_for_selector:");
      logger.l("   "+selector);
      const ishidden="function isHidden(el) {var style = window.getComputedStyle(el);return (style.display === 'none')};";
      if (attempts==null) attempts=100;
      let succeed=false;
      do{
          attempts--;
//          logger.l("await Runtime.evaluate...attepmts left="+attempts);
          const {result:result} = await Runtime.evaluate({expression: ishidden+'isHidden(document.querySelector("'+selector+'"));'});
//          logger.l("await Runtime.evaluate...ok result="+JSON.stringify(result));
          if ((result.type==='boolean')&&(!result.value)) {
             succeed=true;
             logger.l("wait_for_selector:ok");
             await doscreenshot();
             break;
          }
//          logger.l("waiting 300ms...");
          await timeout(300);
//          logger.l("waiting 300ms...ok");
      } while (attempts>0);
      if (!succeed) {
          logger.l("wait_for_selector:failed!");
          await doscreenshot();
          }
      return succeed;
  }
 
  async function wait_for_selector_value(selector,value,attempts,secret){
      await doscreenshot();
      logger.l("wait_for_selector_value:");
      logger.l("   "+selector);
      if (secret==null) logger.l("   "+value);
      if (attempts==null) attempts=100;
      let succeed=false;
      do{
          attempts--;
          const {result:result} = await Runtime.evaluate({expression: 'document.querySelector("'+selector+'").value;'});
          if (result.value===value) {
             succeed=true;
             logger.l("wait_for_selector_value:ok");
             await doscreenshot();
             break;
          }
          await timeout(100);
      } while (attempts>0);
      if (!succeed) {
          logger.l("wait_for_selector_value:failed!");
          await doscreenshot();
          }
      return succeed;
  }
 
  async function wait_for_selector_value_secret(selector,value,attempts){
     return await wait_for_selector_value(selector,value,attempts,true);
  }
 
  async function wait_for_selector_text_changed(selector,text,attempts){
      await doscreenshot();
      logger.l("wait_for_selector_text_changed:");
      logger.l("   "+selector);
      logger.l("   "+text);
      if (attempts==null) attempts=100;
      let succeed=false;
      do{
          attempts--;
          const {result:result} = await Runtime.evaluate({expression: 'document.querySelector("'+selector+'").innerText;'});
          if ((result.type==='string')&&(result.value!==text)) {
             succeed=true;
             logger.l("wait_for_selector_text_changed:ok "+result.value);
             await doscreenshot();
             break;
          }
          await timeout(100);
      } while (attempts>0);
      if (!succeed) {
          logger.l("wait_for_selector_text_changed:failed!");
          await doscreenshot();
          }
      return succeed;
  }
 
  async function wait_for_selector_text(selector,text,attempts){
      await doscreenshot();
      logger.l("wait_for_selector_text:");
      logger.l("   "+selector);
      logger.l("   "+text);
      if (attempts==null) attempts=100;
      let succeed=false;
      do{
          attempts--;
          const {result:result} = await Runtime.evaluate({expression: 'document.querySelector("'+selector+'").innerText;'});
          if ((result.type==='string')&&(result.value===text)) {
             succeed=true;
             logger.l("wait_for_selector_text:ok");
             await doscreenshot();
             break;
          }
          await timeout(100);
      } while (attempts>0);
      if (!succeed) {
          logger.l("wait_for_selector_text:failed!");
          await doscreenshot();
          }
      return succeed;
  }
 
 
  async function click(selector){
     if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
     await Runtime.evaluate({expression: 'document.querySelector("'+selector+'").click()'});
  }
 
  async function focus(selector){
     if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
     await Runtime.evaluate({expression: 'document.querySelector("'+selector+'").focus()'});
  }
 
  async function set_str_value(selector,value){
     if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
     await Runtime.evaluate({expression: 'document.querySelector("'+selector+'").value="'+value+'";'});
  }
 
  async function get_value(selector){
     if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
     return (await Runtime.evaluate({expression: 'document.querySelector("'+selector+'").value'})).result.value;
  }
 
  async function get_text(selector){
     if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
     return (await Runtime.evaluate({expression: 'document.querySelector("'+selector+'").innerText'})).result.value;
  }
 
  async function change_text(selector){
     var text = await get_value(selector);
     logger.l("text='"+text+"'");
     
     await focus(selector);
     await Input.dispatchKeyEvent({ type: 'char', text: 'm' }); 
     if (!await wait_for_selector_value(selector,text+"m"))  await Input.dispatchKeyEvent({ type: 'char', text: 'm' }); 
     if (!await wait_for_selector_value(selector,text+"m")) return exit("Error: wait_for_selector_value");
     await Input.dispatchKeyEvent({ type: 'rawKeyDown', windowsVirtualKeyCode: 8 })
     if (!await wait_for_selector_value(selector,text)) return exit("Error: wait_for_selector_value");
  }
 
 
 
  async function get_class(selector){
     if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
     return (await Runtime.evaluate({expression: 'document.querySelector("'+selector+'").className'})).result.value;
  }
 
  async function change(selector,value){
     if (!await wait_for_selector(selector,300)) return exit("Error: wait_for_selector");
     await Runtime.evaluate({expression: 'var el=document.querySelector("'+selector+'");el.value="'+value+'";event = document.createEvent("HTMLEvents");'+
        'event.initEvent("input", true, true);event.eventName = "input";el.dispatchEvent(event);'});
  }
 
  async function evaluate(expression){
     return (await Runtime.evaluate({expression: expression})).result.value;
  }
 
  function exit(msg){
     client.close();
     logger.l(msg);
     logger.l(new Date());
     logger.ended("FAILED");
     throw msg;
     return false;
  }
 
  async function screenshot(dir,name){
      const screenshot = await Page.captureScreenshot({format});
      const buffer = new Buffer(screenshot.data, 'base64');
      if (!file.existsSync(dir)){
          file.mkdirSync(dir);
      }
      file.writeFileSync(dir+"/"+name, buffer, 'base64');
      logger.l(((new Date()-start_time)/1000).toFixed(0)+' sec. Screenshot '+name+' saved');
  }
 
  async function doscreenshot(){
     await screenshot("images/"+logfile_name,"screenshot"+((current_screenshot_num+10000)+"").substr(1)+".png");
     current_screenshot_num++;
  }
  await Page.enable();
  await DOM.enable();
  await Network.enable();
 
  const deviceMetrics = {
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 0,
    mobile: false,
    fitWindow: false,
  };
  await Emulation.setDeviceMetricsOverride(deviceMetrics);
  await Emulation.setVisibleSize({width: viewportWidth, height: viewportHeight});
 
  var start_time=new Date();
  logfile_name=logger.getFN();
 
  async function Raiffeisen_Ilya(){
// Raiffeisen: navigate to the landing page
     await Page.navigate({url:raif_url});
     var raif_username=raif_username_field;
     var raif_password=raif_password_field;
     if (!await wait_for_selector(raif_username,600)) return exit("Error: wait_for_selector");
// Raiffeisen: check if logout needed
     if (await wait_for_selector(logout_link)) {
        await click(logout_link);
        if (!await wait_for_selector(raif_username)) return exit("Error: wait_for_selector logout_link");
     }
// Raiffeisen: enter username and password
     await set_str_value(raif_username,raif_username_value);
     if (!await wait_for_selector_value(raif_username,raif_username_value)) return exit("Error: wait_for_selector_value raif_username");
     await Input.dispatchKeyEvent({ type: 'char', text: 'm' }); 
     if (!await wait_for_selector_value(raif_username,raif_username_value+"m"))  await Input.dispatchKeyEvent({ type: 'char', text: 'm' }); 
     if (!await wait_for_selector_value(raif_username,raif_username_value+"m")) return exit("Error: wait_for_selector_value raif_username");
     await Input.dispatchKeyEvent({ type: 'rawKeyDown', windowsVirtualKeyCode: 8 })
     if (!await wait_for_selector_value(raif_username,raif_username_value)) return exit("Error: wait_for_selector_value raif_username");
     await set_str_value(raif_password,raif_password_value);
     await focus(raif_password);
     if (!await wait_for_selector_value_secret(raif_password,raif_password_value)) return exit("Error: wait_for_selector_value raif_password");
     await Input.dispatchKeyEvent({ type: 'char', text: 'p' });
     if (!await wait_for_selector_value_secret(raif_password,raif_password_value+"p")) await Input.dispatchKeyEvent({ type: 'char', text: 'p' });
     if (!await wait_for_selector_value_secret(raif_password,raif_password_value+"p")) return exit("Error: wait_for_selector_value raif_password");
     await Input.dispatchKeyEvent({ type: 'rawKeyDown', windowsVirtualKeyCode: 8 })
     if (!await wait_for_selector_value_secret(raif_password,raif_password_value)) return exit("Error: wait_for_selector_value raif_password");
// Raiffeisen: click login button
     if (!await wait_for_selector(login_button,300)) return exit("Error: wait_for_selector login_button");
     await click(login_button);
// Raiffeisen: grab a balance
     if (!await wait_for_selector(balance_of_usd_account,300)) return exit("Error: wait_for_selector balance_of_usd_account");
     extract.Raif_ILIA_USD_Balance=await get_text(balance_of_usd_account);
     extract.Raif_ILIA_USD_Balance=parseFloat(extract.Raif_ILIA_USD_Balance.replace(/[^0-9,−]/g,"").replace(",",".").replace("−","-"))+"";
     logger.l(extract.Raif_ILIA_USD_Balance);
// Raiffeisen: click "Vypiska po shetu" link
     if (!await wait_for_selector(vypyska_po_schetu_link,300)) return exit("Error: wait_for_selector vypyska_po_schetu_link");
     await click(vypyska_po_schetu_link);
// Raiffeisen: looking for "Vsego rashodov" title
     if (!await wait_for_selector(vsego_rashodov_label,300)){
// Raiffeisen: looking for "Operatsyi za ukazanniy period ne naydeno"
        if (!await wait_for_selector(operatsyi_za_ukazanniy_period_ne_naydeno_text,300)) return exit("Error: wait_for_selector operatsyi_za_ukazanniy_period_ne_naydeno_text");
     }
// Raiffeisen: enter filter
// This an amount below "Vsego raskhodov" - we will wait until it has been changed after we put start date to 1/1/2016
     var initial_value="";
     if (await wait_for_selector(vsego_rashodov_label))
        initial_value=await get_text(vsego_rashodov_label);
// Raiffeisen: put 1/1/2017 as the start date
     if (!await wait_for_selector(za_period_first_date_field,300)) return exit("Error: wait_for_selector za_period_first_date_field");
     await change(za_period_first_date_field,"01.01.2017");
// Raiffeisen: we are waiting until the amount in dollars has been changed
     if (!await wait_for_selector_text_changed(vsego_rashodov_label,initial_value,300)) return exit("Error: wait_for_selector_text_changed vsego_rashodov_label");
// Raiffeisen: click "Pokazat eshe" button until the last date is a half an year earlier 
     function convert_date(str){var tmp=str.split(".");return new Date(tmp[1]+"/"+tmp[0]+"/"+tmp[2])}
     do{
        await click(pokazat_esche_button);
        if (!await wait_for_selector_text(pokazat_esche_button,"Загрузка...",300)) return exit("Error: wait_for_selector_text pokazat_esche_button(1)");
        if (!await wait_for_selector_text(pokazat_esche_button,"Показать ещё",300)) return exit("Error: wait_for_selector_text pokazat_esche_button(2)");
        var last_date=convert_date(await evaluate('document.querySelector("'+transaction_table+'").rows[document.querySelector("'+transaction_table+'").rows.length-3].cells[0].innerText'));
        var rows=await evaluate('document.querySelector("'+transaction_table+'").rows.length');
        logger.l(last_date);
        logger.l(rows);
     } while ((new Date() - last_date)/1000/60/60/24<=182);
// Raiffeisen: extract a table with transactions
     const table_to_array = `
        function table_to_array(el){
           var arr=[];
           for (var i=2;i<=el.rows.length-3;i++){
              var obj={};
              var cells=el.rows[i].cells;
              if (cells.length===5){
                 obj.transaction_date=cells[0].innerText;
                 obj.posting_date=cells[1].innerText;
                 obj.description=cells[2].innerText;
                 obj.amount_with_currency=cells[3].innerText;
                 var amount=parseFloat(cells[4].innerText.replace(/[^0-9,−]/g,"").replace(",",".").replace("−","-"));
                 obj.amount_credit=((amount>0)?amount:0)+"";
                 obj.amount_debit=((amount<0)?-amount:0)+"";
                 obj.detailed_info="";
                 arr.push(obj);
              }
           }
           return JSON.stringify(arr,null,4);
        };
     `;
     var result=await evaluate(table_to_array+'table_to_array(document.querySelector("'+transaction_table+'"))');
     if(result==null) return exit("Error: unable to extract table data!");
     extract.Raif_ILIA_USD_Transactions=JSON.parse(result);
// Raiffeisen: click logout button
     if (!await wait_for_selector(logout_link,300)) return exit("Error: wait_for_selector logout_link");
     await Runtime.evaluate({expression: 'document.querySelector("'+logout_link+'").click()'});
     if (!await wait_for_selector(raif_username)) return exit("Error: wait_for_selector raif_username");
     return true;
  }
 
  async function USBank(extract,username,password,divAvailableCredit,nosavings){
// USBANK: navigate to the landing page
     await Page.navigate({url:usb_url});
// USBANK: enter username
     await set_str_value(usb_username_field,username);
// USBANK: click Continue button
     await click(usb_continue_button);
// USBANK: answer security question
     if (!await wait_for_selector_text_changed(usb_security_question_label,"",300)) return exit("Error: wait_for_selector_text_changed");
     var security_question=await get_text(usb_security_question_label);
     logger.l("'"+security_question+"'");
     if (security_question==="What was your favorite game as a child?") secretWord="soccer";
     else if (security_question==="What was the name of your best friend in college?") secretWord="Max";
     else if (security_question==="In what city or town did your mother and father meet?") secretWord="Moscow";
     else if (security_question==="What is your favorite musicians name?") secretWord="Mozart";
     await set_str_value(usb_security_answer_field,secretWord);
     await change_text(usb_security_answer_field);
     await click(usb_security_answer_submit_button);
// USBANK: enter password
     if (!await wait_for_selector(usb_enter_password_label,300)) return exit("Error: wait_for_selector");
     await set_str_value(usb_password_field,password);
     await change_text(usb_password_field);
// USBANK: click login button
     await click(usb_login_button);
// USBANK: wait for accounts table
     var tmp_sel=usb_deposit_accounts_information;
     if (!await wait_for_selector(tmp_sel,300)) return exit("Error: wait_for_selector");
// USBANK: grab balances
     extract.USBank_Checking=await get_text(usb_checking_account_balance_amount);
     if (nosavings==null) extract.USBank_Savings=await get_text(usb_savings_account_balance_amount);
     extract.USBank_CreditCard_Credit=await get_text(divAvailableCredit);
     extract.USBank_CreditCard_Balance=await get_text(usb_credit_card_current_balance_amount);
// USBANK: get a statement for the checking account 
     await click(usb_savings_account_name_link);
// USBANK: wait for the statement
     if (!await wait_for_selector(usb_transation_table,300)) return exit("Error: wait_for_selector");
// USBANK: grab balances
     extract.USBank_Checking_Account_Balance=await get_text(usb_account_balance_amount);
     tmp_sel=usb_available_balance1;
     if (!await wait_for_selector(tmp_sel,300)) {
        tmp_sel=usb_available_balance2;
        if (!await wait_for_selector(tmp_sel,300)) return exit("Error: wait_for_selector");
     }
     extract.USBank_Checking_Available_Balance=await get_text(tmp_sel);
// USBANK: helper function to extract table data
     var transactions=[];
     async function extract_table_data(table_to_array){
// USBANK: prepare to extract a table with transactions
        var TransactionHistoryTable=usb_transation_table;
        if (!await wait_for_selector(arrowNext,300)) return exit("Error: wait_for_selector");
        while (true) {
// USBANK: extract a table with transactions
           var result=await evaluate(table_to_array+'table_to_array(document.querySelector("'+TransactionHistoryTable+'"))');
          if(result==null) return exit("Error: unable to extract table data!");
           transactions=transactions.concat(JSON.parse(result));
// USBANK: click next page
           if (await get_class(arrowNext)==="middle arrowNext"){
              if (!await wait_for_selector(txtPageNumber,300)) return exit("Error: wait_for_selector");
              var page_number=await get_value(txtPageNumber);
              logger.l("page_number="+page_number);
              page_number = (parseInt(page_number)+1)+"";
              logger.l("next page_number="+page_number);
              if (!await wait_for_selector(arrowNext,300)) return exit("Error: wait_for_selector");
              await click(arrowNext);
              if (!await wait_for_selector_value(txtPageNumber,page_number)) return exit("Error: wait_for_selector_value");
           }else break;
        }
        return true;
     }
// USBANK: extract a table with transactions
     const table_to_array1 = `
        function table_to_array(el){
           var arr=[];
           for (i=0;i<=el.rows.length-1;i++){
              if (el.rows[i].className==="ADTransactionHistoryPostedTrans"){
                 var oneline={};
                 oneline.date       =el.rows[i].cells[1].innerText;
                 oneline.description=el.rows[i].cells[2].innerText;
                 oneline.deposits   =el.rows[i].cells[5].innerText;
                 oneline.withdrawals=el.rows[i].cells[7].innerText;
                 oneline.acctbalance=el.rows[i].cells[9].innerText;
                 arr.push(oneline);
              }
           }
           return JSON.stringify(arr,null,4);
        };
     `;
     transactions=[];
     if (!await extract_table_data(table_to_array1)) return exit("Error: extract_table_data");
     extract.USBank_Checking_Transactions=JSON.parse(JSON.stringify(transactions));
// USBANK: click to My Accounts to get back to the summary page
//     await click("#liMyAccounts > span > a");
     await click(usb_logo);
// USBANK: wait for credit card and click after that
//   but some reason we have to wait for the selector first...
     if (!await wait_for_selector(usb_credit_card_account_name_link,300)) return exit("Error: wait_for_selector");
//   ... take a pause for 3 seconds waiting while the page is ready
     await timeout(3000);
//   ... and click after that only
     await click(usb_credit_card_account_name_link);
// USBANK: wait for the statement
     if (!await wait_for_selector(usb_transation_table,300)) return exit("Error: wait_for_selector");
// USBANK: grab balances
     extract.USBank_Credit_Card_Balance=await get_text(usb_account_balance_amount);
     extract.USBank_Credit_Card_Credit=await get_text(usb_credit_card_credit_amount);
// USBANK: extract a table with transactions
     const table_to_array2 = `
        function table_to_array(el){
           var arr=[];
           for (i=0;i<=el.rows.length-1;i++){
              if ((el.rows[i].className==="ADTransactionHistoryPostedTrans")||(el.rows[i].className==="ADTransactionHistoryPostedTrans ")){
                 var oneline={};
                 oneline.date       =el.rows[i].cells[1].innerText;
                 oneline.description=el.rows[i].cells[2].innerText;
                 oneline.credits    =el.rows[i].cells[4].innerText;
                 oneline.charges    =el.rows[i].cells[6].innerText;
                 arr.push(oneline);
              }
           }
           return JSON.stringify(arr,null,4);
        };
     `;
     transactions=[];
     if (!await extract_table_data(table_to_array2)) return exit("Error: extract_table_data");
     extract.USBank_CreditCard_Transactions=JSON.parse(JSON.stringify(transactions));
// USBANK: logout
     await click(usb_logout_link);
// USBANK: wait for the landing page
     if (!await wait_for_selector(usb_username_field,300)) return exit("Error: wait_for_selector");
     return true;
  }
 
  var extract={};
  extract.USBank_NATALIA={};
  if (!await USBank(extract.USBank_NATALIA,"nkomissarova0915","Dasha22@@",usb_available_credit_amount,true)) return exit("Error: USBank Natalia");
  extract.USBank_ILYA={};
  if (!await USBank(extract.USBank_ILYA,"istupin0717","Anya22@@","#divAvailableCredit4")) return exit("Error: USBank Ilia");
  var date =await getAsync('sudo timedatectl set-timezone Europe/Moscow');
  logger.l(date);
  var date =await getAsync('date');
  logger.l(date);
  if (!await Raiffeisen_Ilya()) return exit("Error: Raiffeisen_Ilya");
// Upload file 
  await process.upload(extract);
// Enrich
  await process.process();
// close the client
  client.close();
  return true;
}
 
async function main(){
  var date =await getAsync('sudo timedatectl set-timezone America/Chicago');
  logger.l(date);
  var date =await getAsync('date');
  logger.l(date);
  var attempts_count=0;
  do {
     attempts_count++;
     logger.l("starting main routine; attempt N"+attempts_count);
     if (await main_routine()) {
        logger.ended("SUCCEED");
        break;
        }
     await timeout(300000);
     if (attempts_count>2) logger.ended("FAILED");
  }while (attempts_count<=2)
  var date =await getAsync('sudo timedatectl set-timezone America/Chicago');
  logger.l(date);
  var date =await getAsync('date');
  logger.l(date);
}
 
main();
 
