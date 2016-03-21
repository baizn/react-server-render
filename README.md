# react-server-render
## 1 目录结构
react-server-render

    -- app
    
        -- home
        
            -- actions
            
            -- components
            
            -- reducers
            
            -- routers
            
            -- constants
            
    -- client
    
        -- index.js
        
    --server
    
        -- index.js
        
        -- server.js
        
        -- api
        
    --package.json
    
    --webpack.config.js
    
    --README.md

 ## 2 使用babel 6.x支持
 
 ### 2.1 Instancing packages
 ```
 npm install babel-loader --save-dev
 //for es6 support
 npm install babel-preset-es2015 --save-dev

 //support jsx
 npm install babel-preset-react --save-dev

 //expreimental es7 features
 npm install babel-preset-stage-0 --save-dev
 ```

 ### 2.2 Runtime support
 
 ```
 npm install babel-polyfill --save
 npm install babel-runtime --save
 npm install babel-plugin-transform-runtime --save-dev
 ```

### 3 webpack配置
详见[webpack.config.js](./webpack.config.js)
