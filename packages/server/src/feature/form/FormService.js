"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormService = void 0;
var infoportal_api_sdk_1 = require("infoportal-api-sdk");
var FormVersionService_js_1 = require("./FormVersionService.js");
var FormAccessService_js_1 = require("./access/FormAccessService.js");
var PrismaHelper_js_1 = require("../../core/PrismaHelper.js");
var ts_utils_1 = require("@axanc/ts-utils");
var KoboSchemaCache_js_1 = require("./KoboSchemaCache.js");
var FormService = /** @class */ (function () {
    function FormService(prisma, formVersion, koboSchemaCache, access, formAccess) {
        if (formVersion === void 0) { formVersion = new FormVersionService_js_1.FormVersionService(prisma); }
        if (koboSchemaCache === void 0) { koboSchemaCache = KoboSchemaCache_js_1.KoboSchemaCache.getInstance(prisma); }
        if (access === void 0) { access = new FormAccessService_js_1.FormAccessService(prisma); }
        if (formAccess === void 0) { formAccess = new FormAccessService_js_1.FormAccessService(prisma); }
        var _this = this;
        this.prisma = prisma;
        this.formVersion = formVersion;
        this.koboSchemaCache = koboSchemaCache;
        this.access = access;
        this.formAccess = formAccess;
        this.getSchema = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var form;
            var formId = _b.formId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.form.findFirst({ select: { id: true, kobo: true }, where: { id: formId } }).then(function (_) {
                            if (_)
                                return __assign(__assign({}, _), { kobo: _.kobo ? PrismaHelper_js_1.PrismaHelper.mapKoboInfo(_.kobo) : _.kobo });
                            return _;
                        })];
                    case 1:
                        form = _c.sent();
                        if (!form)
                            return [2 /*return*/];
                        if (!infoportal_api_sdk_1.Ip.Form.isConnectedToKobo(form))
                            return [2 /*return*/, this.prisma.formVersion
                                    .findFirst({
                                    select: { schema: true },
                                    where: {
                                        formId: formId,
                                        status: 'active',
                                    },
                                })
                                    .then(function (_) { return _ === null || _ === void 0 ? void 0 : _.schema; })];
                        return [2 /*return*/, this.koboSchemaCache.get({ formId: form.id }).then(function (_) { return _.content; })];
                }
            });
        }); };
        this.getSchemaByVersion = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var _;
            var formId = _b.formId, versionId = _b.versionId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.formVersion.findFirst({
                            select: { schema: true },
                            where: {
                                formId: formId,
                                id: versionId,
                            },
                        })];
                    case 1:
                        _ = _c.sent();
                        return [2 /*return*/, _ === null || _ === void 0 ? void 0 : _.schema];
                }
            });
        }); };
        this.create = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var created;
            var name = _b.name, category = _b.category, kobo = _b.kobo, type = _b.type, _c = _b.deploymentStatus, deploymentStatus = _c === void 0 ? 'draft' : _c, uploadedBy = _b.uploadedBy, workspaceId = _b.workspaceId;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.prisma.form.create({
                            include: {
                                kobo: true,
                            },
                            data: {
                                name: name,
                                type: type,
                                category: category,
                                deploymentStatus: deploymentStatus,
                                uploadedBy: uploadedBy,
                                workspaceId: workspaceId,
                                kobo: kobo
                                    ? {
                                        create: {
                                            accountId: kobo.accountId,
                                            koboId: kobo.formId,
                                        },
                                    }
                                    : undefined,
                            },
                        })];
                    case 1:
                        created = _d.sent();
                        return [4 /*yield*/, this.formAccess.create({
                                formId: created.id,
                                workspaceId: workspaceId,
                                email: uploadedBy,
                                level: 'Admin',
                            })];
                    case 2:
                        _d.sent();
                        return [2 /*return*/, PrismaHelper_js_1.PrismaHelper.mapForm(created)];
                }
            });
        }); };
        this.get = function (id) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.form.findFirst({ include: { kobo: true }, where: { id: id } }).then(function (_) {
                        if (!_)
                            return;
                        return PrismaHelper_js_1.PrismaHelper.mapForm(_);
                    })];
            });
        }); };
        this.updateKoboConnexion = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var update;
            var author = _b.author, formId = _b.formId, connected = _b.connected;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.formKoboInfo.update({
                            where: { formId: formId },
                            data: {
                                deletedAt: connected ? null : new Date(),
                                deletedBy: author,
                            },
                        })];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this.get(formId)];
                    case 2:
                        update = _c.sent();
                        if (!update)
                            throw new infoportal_api_sdk_1.HttpError.NotFound("".concat(formId, " not found."));
                        return [2 /*return*/, update];
                }
            });
        }); };
        this.update = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var form, newData, hasActiveVersion;
            var formId = _b.formId, archive = _b.archive, category = _b.category;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.prisma.form.findUnique({ select: { type: true }, where: { id: formId } })];
                    case 1:
                        form = _c.sent();
                        if (!form)
                            throw new infoportal_api_sdk_1.HttpError.NotFound("".concat(formId, " not found."));
                        newData = { category: category };
                        if (!archive) return [3 /*break*/, 2];
                        newData.deploymentStatus = 'archived';
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(archive === false)) return [3 /*break*/, 5];
                        if (!infoportal_api_sdk_1.Ip.Form.isKobo(form)) return [3 /*break*/, 3];
                        newData.deploymentStatus = 'deployed';
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.formVersion.hasActiveVersion({ formId: formId })];
                    case 4:
                        hasActiveVersion = _c.sent();
                        newData.deploymentStatus = hasActiveVersion ? 'deployed' : 'draft';
                        _c.label = 5;
                    case 5: return [2 /*return*/, this.prisma.form
                            .update({
                            include: {
                                kobo: true,
                            },
                            where: { id: formId },
                            data: newData,
                        })
                            .then(PrismaHelper_js_1.PrismaHelper.mapForm)];
                }
            });
        }); };
        this.remove = function (id) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.any([
                            this.prisma.databaseView.deleteMany({ where: { databaseId: id } }),
                            this.prisma.formSubmission.deleteMany({ where: { formId: id } }),
                            this.prisma.formVersion.deleteMany({ where: { formId: id } }),
                            this.prisma.formAccess.deleteMany({ where: { formId: id } }),
                        ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.prisma.form.delete({ where: { id: id } })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getByUser = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var accesses;
            var workspaceId = _b.workspaceId, user = _b.user;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.access.search({ workspaceId: workspaceId, user: user })];
                    case 1:
                        accesses = _c.sent();
                        return [2 /*return*/, this.prisma.form
                                .findMany({
                                include: { kobo: true },
                                where: {
                                    workspaceId: workspaceId,
                                    id: {
                                        in: (0, ts_utils_1.seq)(accesses)
                                            .map(function (_) { return _.formId; })
                                            .compact(),
                                    },
                                },
                            })
                                .then(function (_) { return _.map(PrismaHelper_js_1.PrismaHelper.mapForm); })];
                }
            });
        }); };
        this.getAll = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var wsId = _b.wsId;
            return __generator(this, function (_c) {
                return [2 /*return*/, this.prisma.form
                        .findMany({
                        include: {
                            kobo: true,
                        },
                        where: {
                            workspaceId: wsId,
                        },
                    })
                        .then(function (_) { return _.map(PrismaHelper_js_1.PrismaHelper.mapForm); })];
            });
        }); };
        this.getKoboIdByFormId = function (formId) {
            return _this.prisma.formKoboInfo.findFirst({ select: { koboId: true }, where: { formId: formId } }).then(function (_) { return _ === null || _ === void 0 ? void 0 : _.koboId; });
        };
    }
    return FormService;
}());
exports.FormService = FormService;
