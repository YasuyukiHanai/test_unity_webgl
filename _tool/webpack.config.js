const debug     = process.env.NODE_ENV !== "production";
const webpack   = require('webpack');
const path      = require('path');
const glob      = require("glob");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const TerserPlugin = require('terser-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ssi = require('./node_modules/browsersync-ssi');
const srcDir    = "./src"
const outputDir = "../htdocs/assets"
const entries   = glob.sync('**/**/{!(_)*.js,!(_)*.s[ac]ss}', {
    //ignore: "**/**/*.js",
    cwd: srcDir,
  })
  .map(function (key) {
    // [ '**/*.js' , './src/**/*.js' ]という形式の配列になる // ↓書き出しパス含め配列の書き換え
    return [
      (key.match(/scss$/) ? key.replace('.scss', '.css').replace('scss/', '') :
       key.match(/js$/) ? key.replace('.js', '').replace('js/', '') :
       key)
    , path.resolve(srcDir, key)];
});
const entryObj = Object.fromEntries(entries);

module.exports = {
  entry: entryObj,
  // devtool: debug ? "inline-sourcemap" : false,
  // devtool: 'hidden-source-map',
  output: {
    path: path.resolve(__dirname, outputDir),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  module: {
    rules: [
        {
          test: require.resolve("jquery"),
          loader: "expose-loader",
          options: {
            exposes: ["$", "jQuery"],
          },
        },
        {
          test: /\.js?$/,
          exclude: /(node_modules|bower_components)/,
          use: [{
            loader: 'babel-loader',
            options: {
              plugins: ['react-html-attrs'],
              presets: ["@babel/preset-env","@babel/preset-react"]
            }
          }]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: "style-loader"
            },
            // MiniCssExtractPlugin.loader,  *** 別ファイルに書き出す場合はstyle-loaderではなくこちら ***
            { loader: 'css-loader',
              options: {
                url: false,
                import: true,
              }
            },
            'postcss-loader',
            {
              loader:'sass-loader',
              options: {
                implementation: require.resolve("sass"),
                sassOptions: {
                  outputStyle:'compressed',
                },
              },
            },
          ],
        }
    ]
  },
  devServer: {
    open: false,
    hot: false,
    // port: 3333,
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
        directory:path.resolve(__dirname, '../htdocs'),
        staticOptions: {},
        serveIndex: true,
        watch: true,
    },
  },
  plugins: debug ? [
    new MiniCssExtractPlugin({
      filename: './css/[name]',
    }),
    new RemoveEmptyScriptsPlugin(),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: {
        baseDir: ['../htdocs/'],
        https: true
      },
      files: [
        "../htdocs/**/*.html",
        "**/*.css",
        "**/*.js",
        "!postcss.config.js",
        "!webpack.config.js"
        ],
        "middleware": ssi({
            baseDir: '../htdocs/',
            ext: ".html",
            version: "1.4.0"
        })
    }),
  ] : [
    /* Search for equal or similar files and deduplicate them in the output. */
    // new webpack.optimize.DedupePlugin(), /* It has been removed since Webpack 2 */
    /* Assign the module nad chunk ids by occurrence count.
       Ids that are used often get lower (shorter) ids.
       This make ids predictable reduces total file size and is recommended. */
    new MiniCssExtractPlugin({
      filename: './css/[name]',
    }),
    new RemoveEmptyScriptsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
