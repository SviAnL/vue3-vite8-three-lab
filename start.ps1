<#
  项目启动脚本
  功能：自动切换到项目指定 Node 版本，再启动 Vite 开发服务
  适用环境：Windows + nvm-windows
  注意：1、版本切换为全局生效，会影响系统其他终端的 Node 版本
  注意：2、本项目package.json已配置了engines版本校验，该校验发生在脚本执行之前，所以目前该脚本无法正常执行，先保留该脚本
#>

nvm use (Get-Content .nvmrc)
vite