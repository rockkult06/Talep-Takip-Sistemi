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
exports.id = "app/api/setup-db/route";
exports.ids = ["app/api/setup-db/route"];
exports.modules = {

/***/ "(rsc)/./app/api/setup-db/route.ts":
/*!***********************************!*\
  !*** ./app/api/setup-db/route.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nasync function POST() {\n    try {\n        console.log('Veritabanı setup başlatılıyor...');\n        // Schema dosyasını oku\n        const schemaPath = path__WEBPACK_IMPORTED_MODULE_3___default().join(process.cwd(), 'lib', 'schema.sql');\n        const schemaSQL = fs__WEBPACK_IMPORTED_MODULE_2___default().readFileSync(schemaPath, 'utf8');\n        console.log('Schema dosyası okundu, boyut:', schemaSQL.length, 'karakter');\n        // Temel tabloları oluştur\n        console.log('Temel tablolar oluşturuluyor...');\n        // Talepler tablosu\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`\r\n      CREATE TABLE IF NOT EXISTS talepler (\r\n        id SERIAL PRIMARY KEY,\r\n        talep_sahibi VARCHAR(255) NOT NULL,\r\n        talep_sahibi_aciklamasi VARCHAR(255) NOT NULL,\r\n        talep_sahibi_diger_aciklama TEXT,\r\n        talep_ilcesi VARCHAR(100) NOT NULL,\r\n        bolge VARCHAR(10) NOT NULL,\r\n        hat_no VARCHAR(50) NOT NULL,\r\n        isletici VARCHAR(100) NOT NULL,\r\n        talep_ozeti TEXT NOT NULL,\r\n        talep_iletim_sekli VARCHAR(255) NOT NULL,\r\n        evrak_tarihi DATE,\r\n        evrak_sayisi VARCHAR(100),\r\n        yapilan_is TEXT NOT NULL,\r\n        talep_durumu VARCHAR(100) NOT NULL,\r\n        guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP\r\n      )\r\n    `;\n        console.log('Talepler tablosu oluşturuldu');\n        // Kullanıcılar tablosu\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`\r\n      CREATE TABLE IF NOT EXISTS kullanicilar (\r\n        id SERIAL PRIMARY KEY,\r\n        kullanici_adi VARCHAR(50) UNIQUE NOT NULL,\r\n        sifre_hash VARCHAR(255) NOT NULL,\r\n        ad_soyad VARCHAR(100) NOT NULL,\r\n        rol VARCHAR(20) NOT NULL DEFAULT 'kullanici',\r\n        aktif BOOLEAN DEFAULT true,\r\n        olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\r\n        son_giris_tarihi TIMESTAMP\r\n      )\r\n    `;\n        console.log('Kullanıcılar tablosu oluşturuldu');\n        // Talep logları tablosu\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`\r\n      CREATE TABLE IF NOT EXISTS talep_loglari (\r\n        id SERIAL PRIMARY KEY,\r\n        talep_id INTEGER REFERENCES talepler(id) ON DELETE CASCADE,\r\n        islem_tipi VARCHAR(50) NOT NULL,\r\n        alan_adi VARCHAR(100),\r\n        eski_deger TEXT,\r\n        yeni_deger TEXT,\r\n        aciklama TEXT,\r\n        islem_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\r\n        kullanici_id INTEGER REFERENCES kullanicilar(id),\r\n        kullanici_adi VARCHAR(100)\r\n      )\r\n    `;\n        console.log('Talep logları tablosu oluşturuldu');\n        // İndeksler\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`CREATE INDEX IF NOT EXISTS idx_talepler_guncelleme_tarihi ON talepler(guncelleme_tarihi DESC)`;\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`CREATE INDEX IF NOT EXISTS idx_talepler_talep_durumu ON talepler(talep_durumu)`;\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`CREATE INDEX IF NOT EXISTS idx_talepler_talep_ilcesi ON talepler(talep_ilcesi)`;\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`CREATE INDEX IF NOT EXISTS idx_talep_loglari_talep_id ON talep_loglari(talep_id)`;\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`CREATE INDEX IF NOT EXISTS idx_talep_loglari_islem_tarihi ON talep_loglari(islem_tarihi DESC)`;\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`CREATE INDEX IF NOT EXISTS idx_talep_loglari_kullanici_id ON talep_loglari(kullanici_id)`;\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`CREATE INDEX IF NOT EXISTS idx_kullanicilar_kullanici_adi ON kullanicilar(kullanici_adi)`;\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`CREATE INDEX IF NOT EXISTS idx_kullanicilar_rol ON kullanicilar(rol)`;\n        console.log('İndeksler oluşturuldu');\n        // İlk admin kullanıcısını ekle\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`\r\n      INSERT INTO kullanicilar (kullanici_adi, sifre_hash, ad_soyad, rol) \r\n      VALUES ('Admin01', '116c26365634ad5bf077f82d59f8345e0c6b0f7a3db607de5f60a69f5a093ba2', 'Sistem Yöneticisi', 'admin')\r\n      ON CONFLICT (kullanici_adi) DO NOTHING\r\n    `;\n        console.log('Admin kullanıcısı eklendi');\n        // Kullanıcıları kontrol et\n        const kullanicilar = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])`SELECT COUNT(*) as count FROM kullanicilar`;\n        console.log('Kullanıcı sayısı:', kullanicilar[0]);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: 'Veritabanı setup tamamlandı',\n            userCount: kullanicilar[0]\n        });\n    } catch (error) {\n        console.error('Setup hatası:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Veritabanı setup başarısız',\n            details: error instanceof Error ? error.message : 'Bilinmeyen hata'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NldHVwLWRiL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBd0Q7QUFDN0I7QUFDUDtBQUNJO0FBRWpCLGVBQWVJO0lBQ3BCLElBQUk7UUFDRkMsUUFBUUMsR0FBRyxDQUFDO1FBRVosdUJBQXVCO1FBQ3ZCLE1BQU1DLGFBQWFKLGdEQUFTLENBQUNNLFFBQVFDLEdBQUcsSUFBSSxPQUFPO1FBQ25ELE1BQU1DLFlBQVlULHNEQUFlLENBQUNLLFlBQVk7UUFFOUNGLFFBQVFDLEdBQUcsQ0FBQyxpQ0FBaUNLLFVBQVVFLE1BQU0sRUFBRTtRQUUvRCwwQkFBMEI7UUFDMUJSLFFBQVFDLEdBQUcsQ0FBQztRQUVaLG1CQUFtQjtRQUNuQixNQUFNTCxtREFBRyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQlYsQ0FBQztRQUNESSxRQUFRQyxHQUFHLENBQUM7UUFFWix1QkFBdUI7UUFDdkIsTUFBTUwsbURBQUcsQ0FBQzs7Ozs7Ozs7Ozs7SUFXVixDQUFDO1FBQ0RJLFFBQVFDLEdBQUcsQ0FBQztRQUVaLHdCQUF3QjtRQUN4QixNQUFNTCxtREFBRyxDQUFDOzs7Ozs7Ozs7Ozs7O0lBYVYsQ0FBQztRQUNESSxRQUFRQyxHQUFHLENBQUM7UUFFWixZQUFZO1FBQ1osTUFBTUwsbURBQUcsQ0FBQyw2RkFBNkYsQ0FBQztRQUN4RyxNQUFNQSxtREFBRyxDQUFDLDhFQUE4RSxDQUFDO1FBQ3pGLE1BQU1BLG1EQUFHLENBQUMsOEVBQThFLENBQUM7UUFDekYsTUFBTUEsbURBQUcsQ0FBQyxnRkFBZ0YsQ0FBQztRQUMzRixNQUFNQSxtREFBRyxDQUFDLDZGQUE2RixDQUFDO1FBQ3hHLE1BQU1BLG1EQUFHLENBQUMsd0ZBQXdGLENBQUM7UUFDbkcsTUFBTUEsbURBQUcsQ0FBQyx3RkFBd0YsQ0FBQztRQUNuRyxNQUFNQSxtREFBRyxDQUFDLG9FQUFvRSxDQUFDO1FBQy9FSSxRQUFRQyxHQUFHLENBQUM7UUFFWiwrQkFBK0I7UUFDL0IsTUFBTUwsbURBQUcsQ0FBQzs7OztJQUlWLENBQUM7UUFDREksUUFBUUMsR0FBRyxDQUFDO1FBRVosMkJBQTJCO1FBQzNCLE1BQU1RLGVBQWUsTUFBTWIsbURBQUcsQ0FBQywwQ0FBMEMsQ0FBQztRQUMxRUksUUFBUUMsR0FBRyxDQUFDLHFCQUFxQlEsWUFBWSxDQUFDLEVBQUU7UUFFaEQsT0FBT2QscURBQVlBLENBQUNlLElBQUksQ0FBQztZQUN2QkMsU0FBUztZQUNUQyxXQUFXSCxZQUFZLENBQUMsRUFBRTtRQUM1QjtJQUVGLEVBQUUsT0FBT0ksT0FBTztRQUNkYixRQUFRYSxLQUFLLENBQUMsaUJBQWlCQTtRQUMvQixPQUFPbEIscURBQVlBLENBQUNlLElBQUksQ0FDdEI7WUFDRUcsT0FBTztZQUNQQyxTQUFTRCxpQkFBaUJFLFFBQVFGLE1BQU1GLE9BQU8sR0FBRztRQUNwRCxHQUNBO1lBQUVLLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJEOlxcVGFsZXAgVGFraXAgU2lzdGVtaVxcVGFsZXAtVGFraXAtU2lzdGVtaVxcYXBwXFxhcGlcXHNldHVwLWRiXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xyXG5pbXBvcnQgc3FsIGZyb20gJ0AvbGliL2RiJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVCgpIHtcclxuICB0cnkge1xyXG4gICAgY29uc29sZS5sb2coJ1Zlcml0YWJhbsSxIHNldHVwIGJhxZ9sYXTEsWzEsXlvci4uLicpO1xyXG4gICAgXHJcbiAgICAvLyBTY2hlbWEgZG9zeWFzxLFuxLEgb2t1XHJcbiAgICBjb25zdCBzY2hlbWFQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdsaWInLCAnc2NoZW1hLnNxbCcpO1xyXG4gICAgY29uc3Qgc2NoZW1hU1FMID0gZnMucmVhZEZpbGVTeW5jKHNjaGVtYVBhdGgsICd1dGY4Jyk7XHJcbiAgICBcclxuICAgIGNvbnNvbGUubG9nKCdTY2hlbWEgZG9zeWFzxLEgb2t1bmR1LCBib3l1dDonLCBzY2hlbWFTUUwubGVuZ3RoLCAna2FyYWt0ZXInKTtcclxuICAgIFxyXG4gICAgLy8gVGVtZWwgdGFibG9sYXLEsSBvbHXFn3R1clxyXG4gICAgY29uc29sZS5sb2coJ1RlbWVsIHRhYmxvbGFyIG9sdcWfdHVydWx1eW9yLi4uJyk7XHJcbiAgICBcclxuICAgIC8vIFRhbGVwbGVyIHRhYmxvc3VcclxuICAgIGF3YWl0IHNxbGBcclxuICAgICAgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgdGFsZXBsZXIgKFxyXG4gICAgICAgIGlkIFNFUklBTCBQUklNQVJZIEtFWSxcclxuICAgICAgICB0YWxlcF9zYWhpYmkgVkFSQ0hBUigyNTUpIE5PVCBOVUxMLFxyXG4gICAgICAgIHRhbGVwX3NhaGliaV9hY2lrbGFtYXNpIFZBUkNIQVIoMjU1KSBOT1QgTlVMTCxcclxuICAgICAgICB0YWxlcF9zYWhpYmlfZGlnZXJfYWNpa2xhbWEgVEVYVCxcclxuICAgICAgICB0YWxlcF9pbGNlc2kgVkFSQ0hBUigxMDApIE5PVCBOVUxMLFxyXG4gICAgICAgIGJvbGdlIFZBUkNIQVIoMTApIE5PVCBOVUxMLFxyXG4gICAgICAgIGhhdF9ubyBWQVJDSEFSKDUwKSBOT1QgTlVMTCxcclxuICAgICAgICBpc2xldGljaSBWQVJDSEFSKDEwMCkgTk9UIE5VTEwsXHJcbiAgICAgICAgdGFsZXBfb3pldGkgVEVYVCBOT1QgTlVMTCxcclxuICAgICAgICB0YWxlcF9pbGV0aW1fc2VrbGkgVkFSQ0hBUigyNTUpIE5PVCBOVUxMLFxyXG4gICAgICAgIGV2cmFrX3RhcmloaSBEQVRFLFxyXG4gICAgICAgIGV2cmFrX3NheWlzaSBWQVJDSEFSKDEwMCksXHJcbiAgICAgICAgeWFwaWxhbl9pcyBURVhUIE5PVCBOVUxMLFxyXG4gICAgICAgIHRhbGVwX2R1cnVtdSBWQVJDSEFSKDEwMCkgTk9UIE5VTEwsXHJcbiAgICAgICAgZ3VuY2VsbGVtZV90YXJpaGkgVElNRVNUQU1QIERFRkFVTFQgQ1VSUkVOVF9USU1FU1RBTVBcclxuICAgICAgKVxyXG4gICAgYDtcclxuICAgIGNvbnNvbGUubG9nKCdUYWxlcGxlciB0YWJsb3N1IG9sdcWfdHVydWxkdScpO1xyXG4gICAgXHJcbiAgICAvLyBLdWxsYW7EsWPEsWxhciB0YWJsb3N1XHJcbiAgICBhd2FpdCBzcWxgXHJcbiAgICAgIENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIGt1bGxhbmljaWxhciAoXHJcbiAgICAgICAgaWQgU0VSSUFMIFBSSU1BUlkgS0VZLFxyXG4gICAgICAgIGt1bGxhbmljaV9hZGkgVkFSQ0hBUig1MCkgVU5JUVVFIE5PVCBOVUxMLFxyXG4gICAgICAgIHNpZnJlX2hhc2ggVkFSQ0hBUigyNTUpIE5PVCBOVUxMLFxyXG4gICAgICAgIGFkX3NveWFkIFZBUkNIQVIoMTAwKSBOT1QgTlVMTCxcclxuICAgICAgICByb2wgVkFSQ0hBUigyMCkgTk9UIE5VTEwgREVGQVVMVCAna3VsbGFuaWNpJyxcclxuICAgICAgICBha3RpZiBCT09MRUFOIERFRkFVTFQgdHJ1ZSxcclxuICAgICAgICBvbHVzdHVybWFfdGFyaWhpIFRJTUVTVEFNUCBERUZBVUxUIENVUlJFTlRfVElNRVNUQU1QLFxyXG4gICAgICAgIHNvbl9naXJpc190YXJpaGkgVElNRVNUQU1QXHJcbiAgICAgIClcclxuICAgIGA7XHJcbiAgICBjb25zb2xlLmxvZygnS3VsbGFuxLFjxLFsYXIgdGFibG9zdSBvbHXFn3R1cnVsZHUnKTtcclxuICAgIFxyXG4gICAgLy8gVGFsZXAgbG9nbGFyxLEgdGFibG9zdVxyXG4gICAgYXdhaXQgc3FsYFxyXG4gICAgICBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyB0YWxlcF9sb2dsYXJpIChcclxuICAgICAgICBpZCBTRVJJQUwgUFJJTUFSWSBLRVksXHJcbiAgICAgICAgdGFsZXBfaWQgSU5URUdFUiBSRUZFUkVOQ0VTIHRhbGVwbGVyKGlkKSBPTiBERUxFVEUgQ0FTQ0FERSxcclxuICAgICAgICBpc2xlbV90aXBpIFZBUkNIQVIoNTApIE5PVCBOVUxMLFxyXG4gICAgICAgIGFsYW5fYWRpIFZBUkNIQVIoMTAwKSxcclxuICAgICAgICBlc2tpX2RlZ2VyIFRFWFQsXHJcbiAgICAgICAgeWVuaV9kZWdlciBURVhULFxyXG4gICAgICAgIGFjaWtsYW1hIFRFWFQsXHJcbiAgICAgICAgaXNsZW1fdGFyaWhpIFRJTUVTVEFNUCBERUZBVUxUIENVUlJFTlRfVElNRVNUQU1QLFxyXG4gICAgICAgIGt1bGxhbmljaV9pZCBJTlRFR0VSIFJFRkVSRU5DRVMga3VsbGFuaWNpbGFyKGlkKSxcclxuICAgICAgICBrdWxsYW5pY2lfYWRpIFZBUkNIQVIoMTAwKVxyXG4gICAgICApXHJcbiAgICBgO1xyXG4gICAgY29uc29sZS5sb2coJ1RhbGVwIGxvZ2xhcsSxIHRhYmxvc3Ugb2x1xZ90dXJ1bGR1Jyk7XHJcbiAgICBcclxuICAgIC8vIMSwbmRla3NsZXJcclxuICAgIGF3YWl0IHNxbGBDUkVBVEUgSU5ERVggSUYgTk9UIEVYSVNUUyBpZHhfdGFsZXBsZXJfZ3VuY2VsbGVtZV90YXJpaGkgT04gdGFsZXBsZXIoZ3VuY2VsbGVtZV90YXJpaGkgREVTQylgO1xyXG4gICAgYXdhaXQgc3FsYENSRUFURSBJTkRFWCBJRiBOT1QgRVhJU1RTIGlkeF90YWxlcGxlcl90YWxlcF9kdXJ1bXUgT04gdGFsZXBsZXIodGFsZXBfZHVydW11KWA7XHJcbiAgICBhd2FpdCBzcWxgQ1JFQVRFIElOREVYIElGIE5PVCBFWElTVFMgaWR4X3RhbGVwbGVyX3RhbGVwX2lsY2VzaSBPTiB0YWxlcGxlcih0YWxlcF9pbGNlc2kpYDtcclxuICAgIGF3YWl0IHNxbGBDUkVBVEUgSU5ERVggSUYgTk9UIEVYSVNUUyBpZHhfdGFsZXBfbG9nbGFyaV90YWxlcF9pZCBPTiB0YWxlcF9sb2dsYXJpKHRhbGVwX2lkKWA7XHJcbiAgICBhd2FpdCBzcWxgQ1JFQVRFIElOREVYIElGIE5PVCBFWElTVFMgaWR4X3RhbGVwX2xvZ2xhcmlfaXNsZW1fdGFyaWhpIE9OIHRhbGVwX2xvZ2xhcmkoaXNsZW1fdGFyaWhpIERFU0MpYDtcclxuICAgIGF3YWl0IHNxbGBDUkVBVEUgSU5ERVggSUYgTk9UIEVYSVNUUyBpZHhfdGFsZXBfbG9nbGFyaV9rdWxsYW5pY2lfaWQgT04gdGFsZXBfbG9nbGFyaShrdWxsYW5pY2lfaWQpYDtcclxuICAgIGF3YWl0IHNxbGBDUkVBVEUgSU5ERVggSUYgTk9UIEVYSVNUUyBpZHhfa3VsbGFuaWNpbGFyX2t1bGxhbmljaV9hZGkgT04ga3VsbGFuaWNpbGFyKGt1bGxhbmljaV9hZGkpYDtcclxuICAgIGF3YWl0IHNxbGBDUkVBVEUgSU5ERVggSUYgTk9UIEVYSVNUUyBpZHhfa3VsbGFuaWNpbGFyX3JvbCBPTiBrdWxsYW5pY2lsYXIocm9sKWA7XHJcbiAgICBjb25zb2xlLmxvZygnxLBuZGVrc2xlciBvbHXFn3R1cnVsZHUnKTtcclxuICAgIFxyXG4gICAgLy8gxLBsayBhZG1pbiBrdWxsYW7EsWPEsXPEsW7EsSBla2xlXHJcbiAgICBhd2FpdCBzcWxgXHJcbiAgICAgIElOU0VSVCBJTlRPIGt1bGxhbmljaWxhciAoa3VsbGFuaWNpX2FkaSwgc2lmcmVfaGFzaCwgYWRfc295YWQsIHJvbCkgXHJcbiAgICAgIFZBTFVFUyAoJ0FkbWluMDEnLCAnMTE2YzI2MzY1NjM0YWQ1YmYwNzdmODJkNTlmODM0NWUwYzZiMGY3YTNkYjYwN2RlNWY2MGE2OWY1YTA5M2JhMicsICdTaXN0ZW0gWcO2bmV0aWNpc2knLCAnYWRtaW4nKVxyXG4gICAgICBPTiBDT05GTElDVCAoa3VsbGFuaWNpX2FkaSkgRE8gTk9USElOR1xyXG4gICAgYDtcclxuICAgIGNvbnNvbGUubG9nKCdBZG1pbiBrdWxsYW7EsWPEsXPEsSBla2xlbmRpJyk7XHJcbiAgICBcclxuICAgIC8vIEt1bGxhbsSxY8SxbGFyxLEga29udHJvbCBldFxyXG4gICAgY29uc3Qga3VsbGFuaWNpbGFyID0gYXdhaXQgc3FsYFNFTEVDVCBDT1VOVCgqKSBhcyBjb3VudCBGUk9NIGt1bGxhbmljaWxhcmA7XHJcbiAgICBjb25zb2xlLmxvZygnS3VsbGFuxLFjxLEgc2F5xLFzxLE6Jywga3VsbGFuaWNpbGFyWzBdKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcclxuICAgICAgbWVzc2FnZTogJ1Zlcml0YWJhbsSxIHNldHVwIHRhbWFtbGFuZMSxJyxcclxuICAgICAgdXNlckNvdW50OiBrdWxsYW5pY2lsYXJbMF1cclxuICAgIH0pO1xyXG4gICAgXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1NldHVwIGhhdGFzxLE6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IFxyXG4gICAgICAgIGVycm9yOiAnVmVyaXRhYmFuxLEgc2V0dXAgYmHFn2FyxLFzxLF6JywgXHJcbiAgICAgICAgZGV0YWlsczogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnQmlsaW5tZXllbiBoYXRhJyBcclxuICAgICAgfSxcclxuICAgICAgeyBzdGF0dXM6IDUwMCB9XHJcbiAgICApO1xyXG4gIH1cclxufSAiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwic3FsIiwiZnMiLCJwYXRoIiwiUE9TVCIsImNvbnNvbGUiLCJsb2ciLCJzY2hlbWFQYXRoIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJzY2hlbWFTUUwiLCJyZWFkRmlsZVN5bmMiLCJsZW5ndGgiLCJrdWxsYW5pY2lsYXIiLCJqc29uIiwibWVzc2FnZSIsInVzZXJDb3VudCIsImVycm9yIiwiZGV0YWlscyIsIkVycm9yIiwic3RhdHVzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/setup-db/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _neondatabase_serverless__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neondatabase/serverless */ \"(rsc)/./node_modules/@neondatabase/serverless/index.mjs\");\n\nconst sql = (0,_neondatabase_serverless__WEBPACK_IMPORTED_MODULE_0__.neon)(process.env.DATABASE_URL);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sql);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBZ0Q7QUFFaEQsTUFBTUMsTUFBTUQsOERBQUlBLENBQUNFLFFBQVFDLEdBQUcsQ0FBQ0MsWUFBWTtBQUV6QyxpRUFBZUgsR0FBR0EsRUFBQyIsInNvdXJjZXMiOlsiRDpcXFRhbGVwIFRha2lwIFNpc3RlbWlcXFRhbGVwLVRha2lwLVNpc3RlbWlcXGxpYlxcZGIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmVvbiB9IGZyb20gJ0BuZW9uZGF0YWJhc2Uvc2VydmVybGVzcyc7XHJcblxyXG5jb25zdCBzcWwgPSBuZW9uKHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCEpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3FsOyAiXSwibmFtZXMiOlsibmVvbiIsInNxbCIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsetup-db%2Froute&page=%2Fapi%2Fsetup-db%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsetup-db%2Froute.ts&appDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsetup-db%2Froute&page=%2Fapi%2Fsetup-db%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsetup-db%2Froute.ts&appDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Talep_Takip_Sistemi_Talep_Takip_Sistemi_app_api_setup_db_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/setup-db/route.ts */ \"(rsc)/./app/api/setup-db/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/setup-db/route\",\n        pathname: \"/api/setup-db\",\n        filename: \"route\",\n        bundlePath: \"app/api/setup-db/route\"\n    },\n    resolvedPagePath: \"D:\\\\Talep Takip Sistemi\\\\Talep-Takip-Sistemi\\\\app\\\\api\\\\setup-db\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Talep_Takip_Sistemi_Talep_Takip_Sistemi_app_api_setup_db_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzZXR1cC1kYiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGc2V0dXAtZGIlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZzZXR1cC1kYiUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDVGFsZXAlMjBUYWtpcCUyMFNpc3RlbWklNUNUYWxlcC1UYWtpcC1TaXN0ZW1pJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1EJTNBJTVDVGFsZXAlMjBUYWtpcCUyMFNpc3RlbWklNUNUYWxlcC1UYWtpcC1TaXN0ZW1pJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUMwQjtBQUN2RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiRDpcXFxcVGFsZXAgVGFraXAgU2lzdGVtaVxcXFxUYWxlcC1UYWtpcC1TaXN0ZW1pXFxcXGFwcFxcXFxhcGlcXFxcc2V0dXAtZGJcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3NldHVwLWRiL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvc2V0dXAtZGJcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3NldHVwLWRiL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcVGFsZXAgVGFraXAgU2lzdGVtaVxcXFxUYWxlcC1UYWtpcC1TaXN0ZW1pXFxcXGFwcFxcXFxhcGlcXFxcc2V0dXAtZGJcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsetup-db%2Froute&page=%2Fapi%2Fsetup-db%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsetup-db%2Froute.ts&appDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

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

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@neondatabase"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsetup-db%2Froute&page=%2Fapi%2Fsetup-db%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsetup-db%2Froute.ts&appDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CTalep%20Takip%20Sistemi%5CTalep-Takip-Sistemi&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();