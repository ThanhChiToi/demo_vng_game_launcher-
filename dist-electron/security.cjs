"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowSelfSignedLocalhostInDev = allowSelfSignedLocalhostInDev;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
function isLocalhost(url) {
    try {
        return LOCAL_HOSTS.has(new URL(url).hostname);
    }
    catch {
        return false;
    }
}
/**
 * Backend .NET lúc dev chạy HTTPS với chứng chỉ self-signed (dotnet dev-certs),
 * Electron mặc định từ chối -> mọi request đều fail mà không rõ lý do.
 *
 * Chỉ bỏ qua lỗi chứng chỉ khi: app chưa đóng gói VÀ host là localhost.
 * Bản release sẽ không bao giờ chạy vào nhánh này.
 */
function allowSelfSignedLocalhostInDev(app) {
    if (app.isPackaged)
        return;
    app.on('certificate-error', (event, _webContents, url, _error, _certificate, callback) => {
        if (isLocalhost(url)) {
            event.preventDefault();
            callback(true);
            return;
        }
        callback(false);
    });
}
//# sourceMappingURL=security.cjs.map