# CuraMed website

Please see readme from https://github.com/Cura-Med/GoogleCloudDeployReactStarter on how to deploy the website to google cloud

Commands:
pnpm run dev         
to run it locally

pnpm run build       
to build dist folder with static files           

copy the dist folder to where we have files prepared like on project https://github.com/Cura-Med/GoogleCloudDeployReactStarter

gcloud auth login

gcloud run deploy curamed-website

It has been deployed to https://curamed-website-973580931654.europe-north1.run.app
