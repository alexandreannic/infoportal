"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoboFormService = void 0;
var ts_utils_1 = require("@axanc/ts-utils");
var promise_pool_1 = require("@supercharge/promise-pool");
var AppConf_js_1 = require("../../core/conf/AppConf.js");
var index_js_1 = require("../../index.js");
var KoboSdkGenerator_js_1 = require("./KoboSdkGenerator.js");
var PrismaHelper_js_1 = require("../../core/PrismaHelper.js");
var FormService_js_1 = require("../form/FormService.js");
var KoboFormService = /** @class */ (function () {
    function KoboFormService(prisma, koboSdk, form, cache, conf) {
        if (koboSdk === void 0) { koboSdk = KoboSdkGenerator_js_1.KoboSdkGenerator.getSingleton(prisma); }
        if (form === void 0) { form = new FormService_js_1.FormService(prisma); }
        if (cache === void 0) { cache = index_js_1.app.cache; }
        if (conf === void 0) { conf = AppConf_js_1.appConf; }
        var _this = this;
        this.prisma = prisma;
        this.koboSdk = koboSdk;
        this.form = form;
        this.cache = cache;
        this.conf = conf;
        this.importFromKobo = function (payload) { return __awaiter(_this, void 0, void 0, function () {
            var sdk, schema, newFrom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.koboSdk.getBy.accountId(payload.serverId)];
                    case 1:
                        sdk = _a.sent();
                        return [4 /*yield*/, sdk.v2.form.get({ formId: payload.uid, use$autonameAsName: true })];
                    case 2:
                        schema = _a.sent();
                        return [4 /*yield*/, Promise.all([
                                this.form.create(KoboFormService.apiToDb({
                                    schema: schema,
                                    accountId: payload.serverId,
                                    uploadedBy: payload.uploadedBy,
                                    workspaceId: payload.workspaceId,
                                })),
                                // this.prisma.form.create({
                                //   include: {
                                //     kobo: true,
                                //   },
                                //   data: KoboFormService.apiToDb({
                                //     schema,
                                //     accountId: payload.serverId,
                                //     uploadedBy: payload.uploadedBy,
                                //     workspaceId: payload.workspaceId,
                                //   }),
                                // }),
                                this.createHookIfNotExists({ sdk: sdk, koboFormId: payload.uid }),
                            ])];
                    case 3:
                        newFrom = (_a.sent())[0];
                        this.cache.clear(index_js_1.AppCacheKey.KoboServerIndex);
                        this.cache.clear(index_js_1.AppCacheKey.KoboClient);
                        return [2 /*return*/, PrismaHelper_js_1.PrismaHelper.mapForm(newFrom)];
                }
            });
        }); };
        this.deleteHookIfExists = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var formId = _b.formId, sdk = _b.sdk;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!sdk) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.koboSdk.getBy.koboFormId(formId)];
                    case 1:
                        sdk = _c.sent();
                        _c.label = 2;
                    case 2: return [4 /*yield*/, sdk.v2.hook.deleteByName({ formId: formId, name: KoboFormService.HOOK_NAME }).catch(function () { })];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.update = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var koboFormId, sdk, queries;
            var formId = _b.formId, archive = _b.archive;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.form
                            .findFirst({ where: { id: formId, kobo: { isNot: null } }, select: { kobo: true } })
                            .then(function (_) { var _a; return (_a = _ === null || _ === void 0 ? void 0 : _.kobo) === null || _a === void 0 ? void 0 : _a.koboId; })];
                    case 1:
                        koboFormId = _c.sent();
                        if (!koboFormId)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.koboSdk.getBy.koboFormId(koboFormId)];
                    case 2:
                        sdk = _c.sent();
                        queries = [];
                        if (archive) {
                            queries.push(this.deleteHookIfExists({ formId: koboFormId, sdk: sdk }));
                        }
                        else if (archive === false) {
                            queries.push(this.createHookIfNotExists({ koboFormId: koboFormId, sdk: sdk }));
                        }
                        if (archive !== undefined) {
                            queries.push(sdk.v2.form.updateDeployment({ formId: koboFormId, active: !archive }));
                        }
                        return [4 /*yield*/, Promise.all(queries)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.createHookIfNotExists = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var hooks;
            var sdk = _b.sdk, koboFormId = _b.koboFormId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!sdk) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.koboSdk.getBy.koboFormId(koboFormId)];
                    case 1:
                        sdk = _c.sent();
                        _c.label = 2;
                    case 2: return [4 /*yield*/, sdk.v2.hook.get({ formId: koboFormId })];
                    case 3:
                        hooks = _c.sent();
                        if (hooks.results.find(function (_) { return _.name === KoboFormService.HOOK_NAME; }))
                            return [2 /*return*/];
                        return [2 /*return*/, sdk.v2.hook.create({
                                formId: koboFormId,
                                destinationUrl: this.conf.baseUrl + "/kobo-api/webhook",
                                name: KoboFormService.HOOK_NAME,
                            })];
                }
            });
        }); };
        // readonly registerHooksForAll = async () => {
        //   const forms = await this.prisma.form.findMany({where: {kobo: {isNot: null}}}).then(_ => seq(_).compactBy('serverId'))
        //   const sdks = await Promise.all(
        //     seq(forms)
        //       .distinct(_ => _.serverId)
        //       .get()
        //       .map(server =>
        //         this.koboSdk.getBy.serverId(server.serverId).then(_ => ({
        //           serverId: server.serverId,
        //           sdk: _,
        //         })),
        //       ),
        //   ).then(_ => seq(_).reduceObject<Record<string, KoboClient>>(_ => [_.serverId!, _.sdk]))
        //   await Promise.all(
        //     forms.map(async form =>
        //       this.createHookIfNotExists({sdk: sdks[form.serverId], formId: form.id}).catch(() =>
        //         console.log(`Not created ${form.id}`),
        //       ),
        //     ),
        //   )
        // }
        this.getAll = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var wsId = _b.wsId;
            return __generator(this, function (_c) {
                return [2 /*return*/, this.prisma.form
                        .findMany({
                        include: {
                            kobo: true,
                        },
                        where: {
                            kobo: { isNot: null },
                            workspaceId: wsId,
                        },
                    })
                        .then(function (_) { return _.map(PrismaHelper_js_1.PrismaHelper.mapForm); })];
            });
        }); };
        this.refreshAll = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var forms, sdks, indexForm, indexSchema;
            var _this = this;
            var byEmail = _b.byEmail, wsId = _b.wsId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getAll({ wsId: wsId }).then(ts_utils_1.seq)];
                    case 1:
                        forms = _c.sent();
                        return [4 /*yield*/, Promise.all(forms
                                .map(function (_) { var _a; return (_a = _.kobo) === null || _a === void 0 ? void 0 : _a.accountId; })
                                .compact()
                                .distinct(function (_) { return _; })
                                .map(function (_) { return _this.koboSdk.getBy.accountId(_); })
                                .get())];
                    case 2:
                        sdks = _c.sent();
                        indexForm = (0, ts_utils_1.seq)(forms).groupByFirst(function (_) { return _.id; });
                        return [4 /*yield*/, Promise.all(sdks.map(function (_) { return _.v2.form.getAll(); }))
                                .then(function (_) { return _.flatMap(function (_) { return _.results; }); })
                                .then(function (_) { return (0, ts_utils_1.seq)(_).groupByFirst(function (_) { return _.uid; }); })];
                    case 3:
                        indexSchema = _c.sent();
                        return [4 /*yield*/, promise_pool_1.PromisePool.withConcurrency(this.conf.db.maxConcurrency)
                                .for(forms)
                                .handleError(function (error) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    throw error;
                                });
                            }); })
                                .process(function (form) {
                                var _a = KoboFormService.apiToDb({
                                    schema: indexSchema[form.id],
                                    accountId: indexForm[form.id].kobo.accountId,
                                    uploadedBy: byEmail,
                                    workspaceId: wsId,
                                }), kobo = _a.kobo, db = __rest(_a, ["kobo"]);
                                return _this.prisma.form.update({
                                    include: {
                                        kobo: true,
                                    },
                                    data: db,
                                    where: {
                                        id: form.id,
                                    },
                                });
                            })];
                    case 4:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); };
    }
    KoboFormService.apiToDb = function (_a) {
        var schema = _a.schema, accountId = _a.accountId, uploadedBy = _a.uploadedBy, workspaceId = _a.workspaceId;
        return {
            type: 'kobo',
            name: schema.name,
            deploymentStatus: schema.deployment_status,
            kobo: {
                accountId: accountId,
                formId: schema.uid,
            },
            uploadedBy: uploadedBy,
            workspaceId: workspaceId,
        };
    };
    KoboFormService.HOOK_NAME = 'InfoPortal';
    return KoboFormService;
}());
exports.KoboFormService = KoboFormService;
