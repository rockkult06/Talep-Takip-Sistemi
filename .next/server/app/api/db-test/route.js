/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/db-test/route";
exports.ids = ["app/api/db-test/route"];
exports.modules = {

/***/ "(rsc)/./app/api/db-test/route.ts":
/*!**********************************!*\
  !*** ./app/api/db-test/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n\n\nasync function GET() {\n    try {\n        console.log('DB Test endpoint çağrıldı');\n        // Basit veritabanı testi\n        const testResult = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`SELECT 1 as test`;\n        console.log('Basit test sonucu:', testResult);\n        // Kullanıcılar tablosunu kontrol et\n        try {\n            const kullanicilar = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`SELECT COUNT(*) as count FROM kullanicilar`;\n            console.log('Kullanıcı sayısı:', kullanicilar[0]);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Veritabanı bağlantısı başarılı',\n                testResult: testResult[0],\n                userCount: kullanicilar[0]\n            });\n        } catch (tableError) {\n            console.error('Kullanıcılar tablosu hatası:', tableError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Veritabanı bağlantısı var ama kullanıcılar tablosu yok',\n                testResult: testResult[0],\n                tableError: tableError instanceof Error ? tableError.message : 'Bilinmeyen tablo hatası'\n            });\n        }\n    } catch (error) {\n        console.error('DB Test hatası:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Veritabanı bağlantısı başarısız',\n            details: error instanceof Error ? error.message : 'Bilinmeyen hata'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2RiLXRlc3Qvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXdEO0FBQzdCO0FBRXBCLGVBQWVFO0lBQ3BCLElBQUk7UUFDRkMsUUFBUUMsR0FBRyxDQUFDO1FBRVoseUJBQXlCO1FBQ3pCLE1BQU1DLGFBQWEsTUFBTUosbURBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztRQUM5Q0UsUUFBUUMsR0FBRyxDQUFDLHNCQUFzQkM7UUFFbEMsb0NBQW9DO1FBQ3BDLElBQUk7WUFDRixNQUFNQyxlQUFlLE1BQU1MLG1EQUFHLENBQUMsMENBQTBDLENBQUM7WUFDMUVFLFFBQVFDLEdBQUcsQ0FBQyxxQkFBcUJFLFlBQVksQ0FBQyxFQUFFO1lBRWhELE9BQU9OLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7Z0JBQ3ZCQyxTQUFTO2dCQUNUSCxZQUFZQSxVQUFVLENBQUMsRUFBRTtnQkFDekJJLFdBQVdILFlBQVksQ0FBQyxFQUFFO1lBQzVCO1FBQ0YsRUFBRSxPQUFPSSxZQUFZO1lBQ25CUCxRQUFRUSxLQUFLLENBQUMsZ0NBQWdDRDtZQUM5QyxPQUFPVixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO2dCQUN2QkMsU0FBUztnQkFDVEgsWUFBWUEsVUFBVSxDQUFDLEVBQUU7Z0JBQ3pCSyxZQUFZQSxzQkFBc0JFLFFBQVFGLFdBQVdGLE9BQU8sR0FBRztZQUNqRTtRQUNGO0lBRUYsRUFBRSxPQUFPRyxPQUFPO1FBQ2RSLFFBQVFRLEtBQUssQ0FBQyxtQkFBbUJBO1FBQ2pDLE9BQU9YLHFEQUFZQSxDQUFDTyxJQUFJLENBQ3RCO1lBQ0VJLE9BQU87WUFDUEUsU0FBU0YsaUJBQWlCQyxRQUFRRCxNQUFNSCxPQUFPLEdBQUc7UUFDcEQsR0FDQTtZQUFFTSxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiRDpcXFRhbGVwIFRha2lwIFNpc3RlbWlcXFRhbGVwLVRha2lwLVNpc3RlbWlcXGFwcFxcYXBpXFxkYi10ZXN0XFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xyXG5pbXBvcnQgc3FsIGZyb20gJ0AvbGliL2RiJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnNvbGUubG9nKCdEQiBUZXN0IGVuZHBvaW50IMOnYcSfcsSxbGTEsScpO1xyXG4gICAgXHJcbiAgICAvLyBCYXNpdCB2ZXJpdGFiYW7EsSB0ZXN0aVxyXG4gICAgY29uc3QgdGVzdFJlc3VsdCA9IGF3YWl0IHNxbGBTRUxFQ1QgMSBhcyB0ZXN0YDtcclxuICAgIGNvbnNvbGUubG9nKCdCYXNpdCB0ZXN0IHNvbnVjdTonLCB0ZXN0UmVzdWx0KTtcclxuICAgIFxyXG4gICAgLy8gS3VsbGFuxLFjxLFsYXIgdGFibG9zdW51IGtvbnRyb2wgZXRcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGt1bGxhbmljaWxhciA9IGF3YWl0IHNxbGBTRUxFQ1QgQ09VTlQoKikgYXMgY291bnQgRlJPTSBrdWxsYW5pY2lsYXJgO1xyXG4gICAgICBjb25zb2xlLmxvZygnS3VsbGFuxLFjxLEgc2F5xLFzxLE6Jywga3VsbGFuaWNpbGFyWzBdKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XHJcbiAgICAgICAgbWVzc2FnZTogJ1Zlcml0YWJhbsSxIGJhxJ9sYW50xLFzxLEgYmHFn2FyxLFsxLEnLFxyXG4gICAgICAgIHRlc3RSZXN1bHQ6IHRlc3RSZXN1bHRbMF0sXHJcbiAgICAgICAgdXNlckNvdW50OiBrdWxsYW5pY2lsYXJbMF1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoICh0YWJsZUVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0t1bGxhbsSxY8SxbGFyIHRhYmxvc3UgaGF0YXPEsTonLCB0YWJsZUVycm9yKTtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcclxuICAgICAgICBtZXNzYWdlOiAnVmVyaXRhYmFuxLEgYmHEn2xhbnTEsXPEsSB2YXIgYW1hIGt1bGxhbsSxY8SxbGFyIHRhYmxvc3UgeW9rJyxcclxuICAgICAgICB0ZXN0UmVzdWx0OiB0ZXN0UmVzdWx0WzBdLFxyXG4gICAgICAgIHRhYmxlRXJyb3I6IHRhYmxlRXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IHRhYmxlRXJyb3IubWVzc2FnZSA6ICdCaWxpbm1leWVuIHRhYmxvIGhhdGFzxLEnXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0RCIFRlc3QgaGF0YXPEsTonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHsgXHJcbiAgICAgICAgZXJyb3I6ICdWZXJpdGFiYW7EsSBiYcSfbGFudMSxc8SxIGJhxZ9hcsSxc8SxeicsIFxyXG4gICAgICAgIGRldGFpbHM6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ0JpbGlubWV5ZW4gaGF0YScgXHJcbiAgICAgIH0sXHJcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgKTtcclxuICB9XHJcbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInNxbCIsIkdFVCIsImNvbnNvbGUiLCJsb2ciLCJ0ZXN0UmVzdWx0Iiwia3VsbGFuaWNpbGFyIiwianNvbiIsIm1lc3NhZ2UiLCJ1c2VyQ291bnQiLCJ0YWJsZUVycm9yIiwiZXJyb3IiLCJFcnJvciIsImRldGFpbHMiLCJzdGF0dXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/db-test/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _neondatabase_serverless__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neondatabase/serverless */ \"(rsc)/./node_modules/@neondatabase/serverless/index.mjs\");\n\nconst sql = (0,_neondatabase_serverless__WEBPACK_IMPORTED_MODULE_0__.neon)(process.env.DATABASE_URL);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sql);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBZ0Q7QUFFaEQsTUFBTUMsTUFBTUQsOERBQUlBLENBQUNFLFFBQVFDLEdBQUcsQ0FBQ0MsWUFBWTtBQUV6QyxpRUFBZUgsR0FBR0EsRUFBQyIsInNvdXJjZXMiOlsiRDpcXFRhbGVwIFRha2lwIFNpc3RlbWlcXFRhbGVwLVRha2lwLVNpc3RlbWlcXGxpYlxcZGIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmVvbiB9IGZyb20gJ0BuZW9uZGF0YWJhc2Uvc2VydmVybGVzcyc7XHJcblxyXG5jb25zdCBzcWwgPSBuZW9uKHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCEpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3FsOyAiXSwibmFtZXMiOlsibmVvbiIsInNxbCIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdb-test%2Froute&page=%2Fapi%2Fdb-test%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdb-test%2Froute.ts&appDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdb-test%2Froute&page=%2Fapi%2Fdb-test%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdb-test%2Froute.ts&appDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Talep_Takip_Sistemi_Talep_Takip_Sistemi_app_api_db_test_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/db-test/route.ts */ \"(rsc)/./app/api/db-test/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/db-test/route\",\n        pathname: \"/api/db-test\",\n        filename: \"route\",\n        bundlePath: \"app/api/db-test/route\"\n    },\n    resolvedPagePath: \"D:\\\\Talep Takip Sistemi\\\\Talep-Takip-Sistemi\\\\app\\\\api\\\\db-test\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Talep_Takip_Sistemi_Talep_Takip_Sistemi_app_api_db_test_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkYi10ZXN0JTJGcm91dGUmcGFnZT0lMkZhcGklMkZkYi10ZXN0JTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGZGItdGVzdCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDVGFsZXAlMjBUYWtpcCUyMFNpc3RlbWklNUNUYWxlcC1UYWtpcC1TaXN0ZW1pJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1EJTNBJTVDVGFsZXAlMjBUYWtpcCUyMFNpc3RlbWklNUNUYWxlcC1UYWtpcC1TaXN0ZW1pJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUN5QjtBQUN0RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiRDpcXFxcVGFsZXAgVGFraXAgU2lzdGVtaVxcXFxUYWxlcC1UYWtpcC1TaXN0ZW1pXFxcXGFwcFxcXFxhcGlcXFxcZGItdGVzdFxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvZGItdGVzdC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2RiLXRlc3RcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2RiLXRlc3Qvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxUYWxlcCBUYWtpcCBTaXN0ZW1pXFxcXFRhbGVwLVRha2lwLVNpc3RlbWlcXFxcYXBwXFxcXGFwaVxcXFxkYi10ZXN0XFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdb-test%2Froute&page=%2Fapi%2Fdb-test%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdb-test%2Froute.ts&appDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@neondatabase"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdb-test%2Froute&page=%2Fapi%2Fdb-test%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdb-test%2Froute.ts&appDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();