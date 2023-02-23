    
The engine works as a separate package, you can run `npm run serve:engine` to compile it locally, also check package.json scripts to check all the related commands. So basically engine is deployed on a separate server which only contains a JSON Configuration file which gets created by the Splash page builder. Based on that configuration file it renders all the vue components on the page.



To be able to test the engine locally, you will need to hack it out. When you run `npm run serve:engine` command it will create a portal folder in `dist/portal` path, which contains a index.html file which you can open in the browser to see how it looks
 

oh and after the complication is complete, you will need to copy a config file into `dist/portal` file.. otherwise it will show you a blank page as it wont know what to render on the page


I personally use `http-server` to test the engine by linking the `dist/portal` directory and then opening it in the browser for testing on the URL like following: `http://127.0.0.1:8801/?version=v1#/guest-form`


The example config files are available at `/fixtures/portal`.
There are different versions there based on it's development history.

This version file is only used on development mode and in production mode, it's loading campaign data and splash_page data separately from the params which is provided from queries.
The example url in production look like below

`PRODUCTION_SERVER/?template_id=XXXX&campaign_id=XXXX&campaign_last_update=XXXXXX#/`

There are more params but `template_id`, `campaign_id` are main params to display pages.

As default, all the action buttons are not working e.g. social login and it only works on production when all the required params are provided. Those are provided from backend.
