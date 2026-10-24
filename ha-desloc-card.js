/* DESLOC Lock Card — MIT License, HA Homelab contributors. */
const VERSION = "0.4.0";
// BEGIN GENERATED I18N — run node scripts/build-i18n.mjs
export const LOCALES = Object.freeze([{"code":"en","name":"English","dir":"ltr"},{"code":"ar","name":"العربية","dir":"rtl"},{"code":"bn","name":"বাংলা","dir":"ltr"},{"code":"cs","name":"Čeština","dir":"ltr"},{"code":"de","name":"Deutsch","dir":"ltr"},{"code":"es","name":"Español","dir":"ltr"},{"code":"fa","name":"فارسی","dir":"rtl"},{"code":"fr","name":"Français","dir":"ltr"},{"code":"he","name":"עברית","dir":"rtl"},{"code":"hi","name":"हिन्दी","dir":"ltr"},{"code":"id","name":"Bahasa Indonesia","dir":"ltr"},{"code":"it","name":"Italiano","dir":"ltr"},{"code":"ja","name":"日本語","dir":"ltr"},{"code":"ko","name":"한국어","dir":"ltr"},{"code":"nl","name":"Nederlands","dir":"ltr"},{"code":"pl","name":"Polski","dir":"ltr"},{"code":"pt","name":"Português","dir":"ltr"},{"code":"ru","name":"Русский","dir":"ltr"},{"code":"th","name":"ไทย","dir":"ltr"},{"code":"tr","name":"Türkçe","dir":"ltr"},{"code":"uk","name":"Українська","dir":"ltr"},{"code":"vi","name":"Tiếng Việt","dir":"ltr"},{"code":"zh-Hans","name":"简体中文","dir":"ltr"},{"code":"zh-Hant","name":"繁體中文","dir":"ltr"}].map(Object.freeze));
export const MESSAGES = Object.freeze(Object.fromEntries(Object.entries({"en":{"state.locked":"Locked","state.unlocked":"Unlocked","state.locking":"Locking…","state.unlocking":"Unlocking…","state.jammed":"Jammed","state.unknown":"Unknown","state.unavailable":"Unavailable","caption":"Reported lock state","details":"Show lock details","action.lock":"Lock","action.unlock":"Unlock","metric.battery":"Battery: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"Unlock “{name}”? This sends a physical unlock command.","error.command":"Command failed or was not confirmed. Check the physical lock before retrying.","error.lock_entity":"Select a lock entity.","error.sensor_entity":"{field} must be a sensor entity.","editor.entity":"Lock","editor.name":"Display name","editor.battery_entity":"Battery sensor (optional)","editor.signal_entity":"Wi-Fi signal sensor (optional)","editor.language":"Language","editor.automatic":"Use Home Assistant language","description":"Lock control, reported state, battery and Wi-Fi signal.","editor.compact":"Compact layout","error.compact":"Compact mode must be true or false.","description.compact":"Compact lock controls, state, battery and Wi-Fi.","error.command_timeout":"DESLOC command confirmation timed out. Check the lock before retrying.","error.command_unconfirmed":"DESLOC acknowledged the command, but the new lock state is not confirmed. Check the lock before retrying.","error.auth_required":"DESLOC authentication requires attention. Reauthenticate in Home Assistant.","error.unavailable":"The lock integration is unavailable. No changes were attempted. Restore its connection first.","error.command_in_progress":"Another command is already in progress for this lock. No changes were attempted. Wait for it to finish before starting a new request."},"ar":{"state.locked":"مقفل","state.unlocked":"غير مقفل","state.locking":"جارٍ القفل…","state.unlocking":"جارٍ إلغاء القفل…","state.jammed":"عالق","state.unknown":"غير معروف","state.unavailable":"غير متاح","caption":"حالة القفل المُبلّغ عنها","details":"عرض تفاصيل القفل","action.lock":"قفل","action.unlock":"إلغاء القفل","metric.battery":"البطارية: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"هل تريد إلغاء قفل «{name}»؟ سيُرسل هذا أمرًا لإلغاء قفل القفل الفعلي.","error.command":"فشل الأمر أو لم يتم تأكيده. تحقق من القفل الفعلي قبل إعادة المحاولة.","error.lock_entity":"اختر كيان قفل.","error.sensor_entity":"يجب أن يكون {field} كيان مستشعر.","editor.entity":"القفل","editor.name":"الاسم المعروض","editor.battery_entity":"مستشعر البطارية (اختياري)","editor.signal_entity":"مستشعر إشارة Wi-Fi (اختياري)","editor.language":"اللغة","editor.automatic":"استخدام لغة Home Assistant","description":"التحكم في القفل وحالته المُبلّغ عنها والبطارية وإشارة Wi-Fi.","editor.compact":"تخطيط مضغوط","error.compact":"يجب أن تكون قيمة الوضع المضغوط true أو false.","description.compact":"عناصر تحكم مضغوطة للقفل والحالة والبطارية وWi-Fi.","error.command_timeout":"انتهت مهلة تأكيد أمر DESLOC. تحقق من القفل قبل إعادة المحاولة.","error.command_unconfirmed":"أقرّ DESLOC باستلام الأمر، لكن حالة القفل الجديدة غير مؤكدة. تحقق من القفل قبل إعادة المحاولة.","error.auth_required":"تتطلب مصادقة DESLOC انتباهك. أعد المصادقة في Home Assistant.","error.unavailable":"تكامل القفل غير متاح. لم تُجرَ أي محاولة للتغيير. استعد الاتصال أولًا.","error.command_in_progress":"يوجد أمر آخر قيد التنفيذ لهذا القفل. لم تُجرَ أي محاولة للتغيير. انتظر اكتماله قبل بدء طلب جديد."},"bn":{"state.locked":"তালাবদ্ধ","state.unlocked":"তালা খোলা","state.locking":"তালা লাগানো হচ্ছে…","state.unlocking":"তালা খোলা হচ্ছে…","state.jammed":"আটকে গেছে","state.unknown":"অজানা","state.unavailable":"অনুপলব্ধ","caption":"রিপোর্ট করা লক অবস্থা","details":"লকের বিবরণ দেখুন","action.lock":"তালা লাগান","action.unlock":"তালা খুলুন","metric.battery":"ব্যাটারি: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"“{name}”-এর তালা খুলবেন? এটি আসল লক খোলার নির্দেশ পাঠাবে।","error.command":"নির্দেশ ব্যর্থ হয়েছে বা নিশ্চিত করা যায়নি। আবার চেষ্টা করার আগে আসল লকটি পরীক্ষা করুন।","error.lock_entity":"একটি লক এনটিটি নির্বাচন করুন।","error.sensor_entity":"{field} অবশ্যই একটি সেন্সর এনটিটি হতে হবে।","editor.entity":"লক","editor.name":"প্রদর্শিত নাম","editor.battery_entity":"ব্যাটারি সেন্সর (ঐচ্ছিক)","editor.signal_entity":"Wi-Fi সিগন্যাল সেন্সর (ঐচ্ছিক)","editor.language":"ভাষা","editor.automatic":"Home Assistant-এর ভাষা ব্যবহার করুন","description":"লক নিয়ন্ত্রণ, জানানো অবস্থা, ব্যাটারি ও Wi-Fi সিগন্যাল।","editor.compact":"সংক্ষিপ্ত বিন্যাস","error.compact":"সংক্ষিপ্ত মোডের মান true অথবা false হতে হবে।","description.compact":"সংক্ষিপ্ত লক নিয়ন্ত্রণ, অবস্থা, ব্যাটারি ও Wi-Fi।","error.command_timeout":"DESLOC কমান্ড নিশ্চিত করার সময় শেষ হয়েছে। আবার চেষ্টার আগে তালা পরীক্ষা করুন।","error.command_unconfirmed":"DESLOC কমান্ড গ্রহণ নিশ্চিত করেছে, কিন্তু তালার নতুন অবস্থা নিশ্চিত নয়। আবার চেষ্টার আগে তালা পরীক্ষা করুন।","error.auth_required":"DESLOC প্রমাণীকরণে মনোযোগ প্রয়োজন। Home Assistant-এ আবার প্রমাণীকরণ করুন।","error.unavailable":"তালার ইন্টিগ্রেশন অনুপলব্ধ। কোনো পরিবর্তনের চেষ্টা করা হয়নি। আগে সংযোগ ফিরিয়ে আনুন।","error.command_in_progress":"এই তালার জন্য অন্য কমান্ড চলছে। কোনো পরিবর্তনের চেষ্টা করা হয়নি। নতুন অনুরোধের আগে তা শেষ হওয়ার অপেক্ষা করুন।"},"cs":{"state.locked":"Zamčeno","state.unlocked":"Odemčeno","state.locking":"Zamykání…","state.unlocking":"Odemykání…","state.jammed":"Zaseknuto","state.unknown":"Neznámý","state.unavailable":"Nedostupný","caption":"Hlášený stav zámku","details":"Zobrazit podrobnosti zámku","action.lock":"Zamknout","action.unlock":"Odemknout","metric.battery":"Baterie: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"Odemknout „{name}“? Tím se odešle příkaz k fyzickému odemknutí zámku.","error.command":"Příkaz selhal nebo nebyl potvrzen. Před dalším pokusem zkontrolujte fyzický zámek.","error.lock_entity":"Vyberte entitu zámku.","error.sensor_entity":"{field} musí být entita senzoru.","editor.entity":"Zámek","editor.name":"Zobrazovaný název","editor.battery_entity":"Senzor baterie (volitelný)","editor.signal_entity":"Senzor signálu Wi-Fi (volitelný)","editor.language":"Jazyk","editor.automatic":"Použít jazyk Home Assistant","description":"Ovládání zámku, hlášený stav, baterie a signál Wi-Fi.","editor.compact":"Kompaktní rozložení","error.compact":"Kompaktní režim musí mít hodnotu true nebo false.","description.compact":"Kompaktní ovládání zámku, stav, baterie a Wi-Fi.","error.command_timeout":"Vypršel časový limit potvrzení příkazu DESLOC. Před opakováním zkontrolujte zámek.","error.command_unconfirmed":"DESLOC potvrdil příkaz, ale nový stav zámku není potvrzen. Před opakováním zkontrolujte zámek.","error.auth_required":"Ověření DESLOC vyžaduje pozornost. Znovu se přihlaste v Home Assistant.","error.unavailable":"Integrace zámku není dostupná. Nebyl proveden žádný pokus o změnu. Nejprve obnovte připojení.","error.command_in_progress":"Pro tento zámek již probíhá jiný příkaz. Nebyl proveden žádný pokus o změnu. Před novým požadavkem počkejte na dokončení."},"de":{"state.locked":"Verriegelt","state.unlocked":"Entriegelt","state.locking":"Wird verriegelt…","state.unlocking":"Wird entriegelt…","state.jammed":"Blockiert","state.unknown":"Unbekannt","state.unavailable":"Nicht verfügbar","caption":"Gemeldeter Schlosszustand","details":"Schlossdetails anzeigen","action.lock":"Verriegeln","action.unlock":"Entriegeln","metric.battery":"Batterie: {value}","metric.signal":"WLAN: {value}","confirm.unlock":"„{name}“ entriegeln? Dadurch wird ein Befehl zum physischen Entriegeln gesendet.","error.command":"Befehl fehlgeschlagen oder nicht bestätigt. Prüfe das Schloss vor Ort, bevor du es erneut versuchst.","error.lock_entity":"Wähle eine Schloss-Entität aus.","error.sensor_entity":"{field} muss eine Sensor-Entität sein.","editor.entity":"Schloss","editor.name":"Anzeigename","editor.battery_entity":"Batteriesensor (optional)","editor.signal_entity":"WLAN-Signalsensor (optional)","editor.language":"Sprache","editor.automatic":"Sprache von Home Assistant verwenden","description":"Schlosssteuerung, gemeldeter Zustand, Batterie und WLAN-Signal.","editor.compact":"Kompaktes Layout","error.compact":"Der Kompaktmodus muss true oder false sein.","description.compact":"Kompakte Schlosssteuerung, Zustand, Batterie und WLAN.","error.command_timeout":"Die Bestätigung des DESLOC-Befehls hat das Zeitlimit überschritten. Prüfen Sie das Schloss vor einem erneuten Versuch.","error.command_unconfirmed":"DESLOC hat den Befehl bestätigt, aber der neue Schlosszustand ist unbestätigt. Prüfen Sie das Schloss vor einem erneuten Versuch.","error.auth_required":"Die DESLOC-Anmeldung erfordert Ihre Aufmerksamkeit. Melden Sie sich in Home Assistant erneut an.","error.unavailable":"Die Schlossintegration ist nicht verfügbar. Es wurden keine Änderungen versucht. Stellen Sie zuerst die Verbindung wieder her.","error.command_in_progress":"Für dieses Schloss läuft bereits ein anderer Befehl. Es wurden keine Änderungen versucht. Warten Sie auf dessen Abschluss, bevor Sie erneut anfragen."},"es":{"state.locked":"Bloqueado","state.unlocked":"Desbloqueado","state.locking":"Bloqueando…","state.unlocking":"Desbloqueando…","state.jammed":"Atascado","state.unknown":"Desconocido","state.unavailable":"No disponible","caption":"Estado comunicado de la cerradura","details":"Mostrar detalles de la cerradura","action.lock":"Bloquear","action.unlock":"Desbloquear","metric.battery":"Batería: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"¿Desbloquear «{name}»? Se enviará una orden para desbloquear físicamente la cerradura.","error.command":"La orden falló o no se confirmó. Comprueba la cerradura física antes de volver a intentarlo.","error.lock_entity":"Selecciona una entidad de cerradura.","error.sensor_entity":"{field} debe ser una entidad de sensor.","editor.entity":"Cerradura","editor.name":"Nombre visible","editor.battery_entity":"Sensor de batería (opcional)","editor.signal_entity":"Sensor de señal Wi-Fi (opcional)","editor.language":"Idioma","editor.automatic":"Usar el idioma de Home Assistant","description":"Control de la cerradura, estado comunicado, batería y señal Wi-Fi.","editor.compact":"Diseño compacto","error.compact":"El modo compacto debe ser true o false.","description.compact":"Controles compactos de cerradura, estado, batería y Wi-Fi.","error.command_timeout":"Se agotó el tiempo de confirmación del comando DESLOC. Compruebe la cerradura antes de reintentar.","error.command_unconfirmed":"DESLOC confirmó el comando, pero no el nuevo estado de la cerradura. Compruebe la cerradura antes de reintentar.","error.auth_required":"La autenticación de DESLOC requiere atención. Autentíquese de nuevo en Home Assistant.","error.unavailable":"La integración de la cerradura no está disponible. No se intentó ningún cambio. Restablezca primero la conexión.","error.command_in_progress":"Ya hay otro comando en curso para esta cerradura. No se intentó ningún cambio. Espere a que termine antes de iniciar otra solicitud."},"fa":{"state.locked":"قفل است","state.unlocked":"قفل باز است","state.locking":"در حال قفل کردن…","state.unlocking":"در حال باز کردن قفل…","state.jammed":"گیر کرده","state.unknown":"نامشخص","state.unavailable":"در دسترس نیست","caption":"وضعیت گزارش‌شدهٔ قفل","details":"نمایش جزئیات قفل","action.lock":"قفل کردن","action.unlock":"باز کردن قفل","metric.battery":"باتری: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"قفل «{name}» باز شود؟ این کار فرمان باز کردن قفل واقعی را ارسال می‌کند.","error.command":"فرمان ناموفق بود یا تأیید نشد. پیش از تلاش دوباره، قفل واقعی را بررسی کنید.","error.lock_entity":"یک موجودیت قفل انتخاب کنید.","error.sensor_entity":"{field} باید یک موجودیت حسگر باشد.","editor.entity":"قفل","editor.name":"نام نمایشی","editor.battery_entity":"حسگر باتری (اختیاری)","editor.signal_entity":"حسگر سیگنال Wi-Fi (اختیاری)","editor.language":"زبان","editor.automatic":"استفاده از زبان Home Assistant","description":"کنترل قفل، وضعیت گزارش‌شده، باتری و سیگنال Wi-Fi.","editor.compact":"چیدمان فشرده","error.compact":"مقدار حالت فشرده باید true یا false باشد.","description.compact":"کنترل فشردهٔ قفل، وضعیت، باتری و Wi-Fi.","error.command_timeout":"مهلت تأیید فرمان DESLOC پایان یافت. پیش از تلاش دوباره قفل را بررسی کنید.","error.command_unconfirmed":"DESLOC دریافت فرمان را تأیید کرد اما وضعیت جدید قفل تأیید نشده است. پیش از تلاش دوباره قفل را بررسی کنید.","error.auth_required":"احراز هویت DESLOC نیاز به رسیدگی دارد. در Home Assistant دوباره احراز هویت کنید.","error.unavailable":"یکپارچه‌سازی قفل در دسترس نیست. هیچ تغییری امتحان نشد. ابتدا اتصال را بازیابی کنید.","error.command_in_progress":"فرمان دیگری برای این قفل در حال اجراست. هیچ تغییری امتحان نشد. پیش از درخواست جدید منتظر پایان آن بمانید."},"fr":{"state.locked":"Verrouillé","state.unlocked":"Déverrouillé","state.locking":"Verrouillage…","state.unlocking":"Déverrouillage…","state.jammed":"Bloqué","state.unknown":"Inconnu","state.unavailable":"Indisponible","caption":"État signalé de la serrure","details":"Afficher les détails de la serrure","action.lock":"Verrouiller","action.unlock":"Déverrouiller","metric.battery":"Batterie : {value}","metric.signal":"Wi-Fi : {value}","confirm.unlock":"Déverrouiller « {name} » ? Cela envoie une commande de déverrouillage physique.","error.command":"La commande a échoué ou n’a pas été confirmée. Vérifiez la serrure physique avant de réessayer.","error.lock_entity":"Sélectionnez une entité de serrure.","error.sensor_entity":"{field} doit être une entité de capteur.","editor.entity":"Serrure","editor.name":"Nom affiché","editor.battery_entity":"Capteur de batterie (facultatif)","editor.signal_entity":"Capteur de signal Wi-Fi (facultatif)","editor.language":"Langue","editor.automatic":"Utiliser la langue de Home Assistant","description":"Commande de serrure, état signalé, batterie et signal Wi-Fi.","editor.compact":"Disposition compacte","error.compact":"Le mode compact doit être true ou false.","description.compact":"Commandes compactes de serrure, état, batterie et Wi-Fi.","error.command_timeout":"Le délai de confirmation de la commande DESLOC est dépassé. Vérifiez la serrure avant de réessayer.","error.command_unconfirmed":"DESLOC a accusé réception de la commande, mais le nouvel état de la serrure n’est pas confirmé. Vérifiez la serrure avant de réessayer.","error.auth_required":"L’authentification DESLOC requiert votre attention. Authentifiez-vous à nouveau dans Home Assistant.","error.unavailable":"L’intégration de la serrure est indisponible. Aucune modification n’a été tentée. Rétablissez d’abord la connexion.","error.command_in_progress":"Une autre commande est en cours pour cette serrure. Aucune modification n’a été tentée. Attendez sa fin avant une nouvelle demande."},"he":{"state.locked":"נעול","state.unlocked":"לא נעול","state.locking":"נועל…","state.unlocking":"מבטל נעילה…","state.jammed":"תקוע","state.unknown":"לא ידוע","state.unavailable":"לא זמין","caption":"מצב המנעול המדווח","details":"הצגת פרטי המנעול","action.lock":"נעילה","action.unlock":"ביטול נעילה","metric.battery":"סוללה: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"לבטל את הנעילה של „{name}“? פעולה זו שולחת פקודה לביטול הנעילה של המנעול הפיזי.","error.command":"הפקודה נכשלה או לא אושרה. יש לבדוק את המנעול הפיזי לפני ניסיון נוסף.","error.lock_entity":"יש לבחור ישות מנעול.","error.sensor_entity":"{field} חייב להיות ישות חיישן.","editor.entity":"מנעול","editor.name":"שם תצוגה","editor.battery_entity":"חיישן סוללה (אופציונלי)","editor.signal_entity":"חיישן אות Wi-Fi (אופציונלי)","editor.language":"שפה","editor.automatic":"שימוש בשפה של Home Assistant","description":"שליטה במנעול, מצב מדווח, סוללה ואות Wi-Fi.","editor.compact":"פריסה קומפקטית","error.compact":"ערך המצב הקומפקטי חייב להיות true או false.","description.compact":"פקדי מנעול קומפקטיים, מצב, סוללה ו-Wi-Fi.","error.command_timeout":"תם הזמן לאישור פקודת DESLOC. יש לבדוק את המנעול לפני ניסיון נוסף.","error.command_unconfirmed":"DESLOC אישר את קבלת הפקודה, אך מצב המנעול החדש לא אושר. יש לבדוק את המנעול לפני ניסיון נוסף.","error.auth_required":"האימות של DESLOC דורש טיפול. יש לאמת מחדש ב־Home Assistant.","error.unavailable":"שילוב המנעול אינו זמין. לא נוסה שום שינוי. יש לשחזר תחילה את החיבור.","error.command_in_progress":"פקודה אחרת כבר מתבצעת עבור מנעול זה. לא נוסה שום שינוי. יש להמתין לסיומה לפני בקשה חדשה."},"hi":{"state.locked":"लॉक है","state.unlocked":"अनलॉक है","state.locking":"लॉक हो रहा है…","state.unlocking":"अनलॉक हो रहा है…","state.jammed":"अटका हुआ","state.unknown":"अज्ञात","state.unavailable":"अनुपलब्ध","caption":"लॉक की बताई गई स्थिति","details":"लॉक का विवरण दिखाएँ","action.lock":"लॉक करें","action.unlock":"अनलॉक करें","metric.battery":"बैटरी: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"“{name}” को अनलॉक करें? इससे वास्तविक लॉक खोलने का आदेश भेजा जाएगा।","error.command":"आदेश विफल हुआ या उसकी पुष्टि नहीं हुई। फिर से प्रयास करने से पहले वास्तविक लॉक की जाँच करें।","error.lock_entity":"एक लॉक एंटिटी चुनें।","error.sensor_entity":"{field} एक सेंसर एंटिटी होनी चाहिए।","editor.entity":"लॉक","editor.name":"प्रदर्शित नाम","editor.battery_entity":"बैटरी सेंसर (वैकल्पिक)","editor.signal_entity":"Wi-Fi सिग्नल सेंसर (वैकल्पिक)","editor.language":"भाषा","editor.automatic":"Home Assistant की भाषा इस्तेमाल करें","description":"लॉक नियंत्रण, बताई गई स्थिति, बैटरी और Wi-Fi सिग्नल।","editor.compact":"कॉम्पैक्ट लेआउट","error.compact":"कॉम्पैक्ट मोड का मान true या false होना चाहिए।","description.compact":"कॉम्पैक्ट लॉक नियंत्रण, स्थिति, बैटरी और Wi-Fi।","error.command_timeout":"DESLOC कमांड की पुष्टि का समय समाप्त हुआ। दोबारा प्रयास से पहले ताला जाँचें।","error.command_unconfirmed":"DESLOC ने कमांड स्वीकार की, लेकिन ताले की नई स्थिति पुष्ट नहीं हुई। दोबारा प्रयास से पहले ताला जाँचें।","error.auth_required":"DESLOC प्रमाणीकरण पर ध्यान देना ज़रूरी है। Home Assistant में दोबारा प्रमाणीकरण करें।","error.unavailable":"ताले का एकीकरण उपलब्ध नहीं है। किसी बदलाव का प्रयास नहीं किया गया। पहले कनेक्शन बहाल करें।","error.command_in_progress":"इस ताले के लिए दूसरी कमांड चल रही है। किसी बदलाव का प्रयास नहीं किया गया। नया अनुरोध शुरू करने से पहले इसके पूरा होने की प्रतीक्षा करें।"},"id":{"state.locked":"Terkunci","state.unlocked":"Tidak terkunci","state.locking":"Mengunci…","state.unlocking":"Membuka kunci…","state.jammed":"Macet","state.unknown":"Tidak diketahui","state.unavailable":"Tidak tersedia","caption":"Status kunci yang dilaporkan","details":"Tampilkan detail kunci","action.lock":"Kunci","action.unlock":"Buka kunci","metric.battery":"Baterai: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"Buka kunci “{name}”? Ini mengirim perintah untuk membuka kunci fisik.","error.command":"Perintah gagal atau belum dikonfirmasi. Periksa kunci fisik sebelum mencoba lagi.","error.lock_entity":"Pilih entitas kunci.","error.sensor_entity":"{field} harus berupa entitas sensor.","editor.entity":"Kunci","editor.name":"Nama tampilan","editor.battery_entity":"Sensor baterai (opsional)","editor.signal_entity":"Sensor sinyal Wi-Fi (opsional)","editor.language":"Bahasa","editor.automatic":"Gunakan bahasa Home Assistant","description":"Kontrol kunci, status yang dilaporkan, baterai, dan sinyal Wi-Fi.","editor.compact":"Tata letak ringkas","error.compact":"Mode ringkas harus bernilai true atau false.","description.compact":"Kontrol kunci ringkas, status, baterai, dan Wi-Fi.","error.command_timeout":"Konfirmasi perintah DESLOC kehabisan waktu. Periksa kunci sebelum mencoba lagi.","error.command_unconfirmed":"DESLOC mengakui perintah, tetapi status kunci baru belum dikonfirmasi. Periksa kunci sebelum mencoba lagi.","error.auth_required":"Autentikasi DESLOC memerlukan perhatian. Autentikasi ulang di Home Assistant.","error.unavailable":"Integrasi kunci tidak tersedia. Tidak ada perubahan yang dicoba. Pulihkan koneksi terlebih dahulu.","error.command_in_progress":"Perintah lain sedang berjalan untuk kunci ini. Tidak ada perubahan yang dicoba. Tunggu hingga selesai sebelum permintaan baru."},"it":{"state.locked":"Bloccato","state.unlocked":"Sbloccato","state.locking":"Blocco in corso…","state.unlocking":"Sblocco in corso…","state.jammed":"Inceppato","state.unknown":"Sconosciuto","state.unavailable":"Non disponibile","caption":"Stato segnalato della serratura","details":"Mostra dettagli della serratura","action.lock":"Blocca","action.unlock":"Sblocca","metric.battery":"Batteria: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"Sbloccare «{name}»? Verrà inviato un comando per sbloccare fisicamente la serratura.","error.command":"Comando non riuscito o non confermato. Controlla la serratura fisica prima di riprovare.","error.lock_entity":"Seleziona un’entità serratura.","error.sensor_entity":"{field} deve essere un’entità sensore.","editor.entity":"Serratura","editor.name":"Nome visualizzato","editor.battery_entity":"Sensore batteria (facoltativo)","editor.signal_entity":"Sensore segnale Wi-Fi (facoltativo)","editor.language":"Lingua","editor.automatic":"Usa la lingua di Home Assistant","description":"Controllo serratura, stato segnalato, batteria e segnale Wi-Fi.","editor.compact":"Layout compatto","error.compact":"La modalità compatta deve essere true o false.","description.compact":"Comandi compatti della serratura, stato, batteria e Wi-Fi.","error.command_timeout":"Tempo scaduto per la conferma del comando DESLOC. Controlla la serratura prima di riprovare.","error.command_unconfirmed":"DESLOC ha confermato il comando, ma il nuovo stato della serratura non è confermato. Controlla la serratura prima di riprovare.","error.auth_required":"L’autenticazione DESLOC richiede attenzione. Autenticati di nuovo in Home Assistant.","error.unavailable":"L’integrazione della serratura non è disponibile. Non sono state tentate modifiche. Ripristina prima la connessione.","error.command_in_progress":"Un altro comando è già in corso per questa serratura. Non sono state tentate modifiche. Attendi che termini prima di una nuova richiesta."},"ja":{"state.locked":"施錠済み","state.unlocked":"解錠済み","state.locking":"施錠中…","state.unlocking":"解錠中…","state.jammed":"動作不良","state.unknown":"不明","state.unavailable":"利用不可","caption":"報告された錠の状態","details":"錠の詳細を表示","action.lock":"施錠","action.unlock":"解錠","metric.battery":"バッテリー: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"「{name}」を解錠しますか？実際の錠を解錠するコマンドを送信します。","error.command":"コマンドが失敗したか、確認できませんでした。再試行する前に実際の錠を確認してください。","error.lock_entity":"錠のエンティティを選択してください。","error.sensor_entity":"{field} はセンサーのエンティティである必要があります。","editor.entity":"錠","editor.name":"表示名","editor.battery_entity":"バッテリーセンサー（任意）","editor.signal_entity":"Wi-Fi 信号センサー（任意）","editor.language":"言語","editor.automatic":"Home Assistant の言語を使用","description":"錠の操作、報告された状態、バッテリー、Wi-Fi 信号。","editor.compact":"コンパクトなレイアウト","error.compact":"コンパクトモードには true または false を指定してください。","description.compact":"コンパクトな錠の操作、状態、バッテリー、Wi-Fi。","error.command_timeout":"DESLOCコマンドの確認がタイムアウトしました。再試行前に錠を確認してください。","error.command_unconfirmed":"DESLOCがコマンドを受け付けましたが、新しい錠の状態は未確認です。再試行前に錠を確認してください。","error.auth_required":"DESLOCの認証に対応が必要です。Home Assistantで再認証してください。","error.unavailable":"錠のインテグレーションを利用できません。変更は試みていません。まず接続を復旧してください。","error.command_in_progress":"この錠では別のコマンドを実行中です。変更は試みていません。完了してから新しいリクエストを開始してください。"},"ko":{"state.locked":"잠김","state.unlocked":"잠금 해제됨","state.locking":"잠그는 중…","state.unlocking":"잠금 해제 중…","state.jammed":"걸림","state.unknown":"알 수 없음","state.unavailable":"사용 불가","caption":"보고된 잠금 상태","details":"잠금 장치 세부 정보 표시","action.lock":"잠그기","action.unlock":"잠금 해제","metric.battery":"배터리: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"“{name}”의 잠금을 해제할까요? 실제 잠금 장치에 잠금 해제 명령을 보냅니다.","error.command":"명령이 실패했거나 확인되지 않았습니다. 다시 시도하기 전에 실제 잠금 장치를 확인하세요.","error.lock_entity":"잠금 장치 엔티티를 선택하세요.","error.sensor_entity":"{field}는 센서 엔티티여야 합니다.","editor.entity":"잠금 장치","editor.name":"표시 이름","editor.battery_entity":"배터리 센서(선택 사항)","editor.signal_entity":"Wi-Fi 신호 센서(선택 사항)","editor.language":"언어","editor.automatic":"Home Assistant 언어 사용","description":"잠금 제어, 보고된 상태, 배터리 및 Wi-Fi 신호.","editor.compact":"간결한 레이아웃","error.compact":"간결한 모드는 true 또는 false여야 합니다.","description.compact":"간결한 잠금 제어, 상태, 배터리 및 Wi-Fi.","error.command_timeout":"DESLOC 명령 확인 시간이 초과되었습니다. 다시 시도하기 전에 잠금장치를 확인하세요.","error.command_unconfirmed":"DESLOC이 명령을 수신했지만 새 잠금 상태는 확인되지 않았습니다. 다시 시도하기 전에 잠금장치를 확인하세요.","error.auth_required":"DESLOC 인증을 확인해야 합니다. Home Assistant에서 다시 인증하세요.","error.unavailable":"잠금장치 통합을 사용할 수 없습니다. 변경을 시도하지 않았습니다. 먼저 연결을 복구하세요.","error.command_in_progress":"이 잠금장치에서 다른 명령이 실행 중입니다. 변경을 시도하지 않았습니다. 완료될 때까지 기다린 후 새 요청을 시작하세요."},"nl":{"state.locked":"Vergrendeld","state.unlocked":"Ontgrendeld","state.locking":"Bezig met vergrendelen…","state.unlocking":"Bezig met ontgrendelen…","state.jammed":"Geblokkeerd","state.unknown":"Onbekend","state.unavailable":"Niet beschikbaar","caption":"Gemelde slotstatus","details":"Slotdetails weergeven","action.lock":"Vergrendelen","action.unlock":"Ontgrendelen","metric.battery":"Batterij: {value}","metric.signal":"Wifi: {value}","confirm.unlock":"‘{name}’ ontgrendelen? Dit verstuurt een opdracht om het fysieke slot te ontgrendelen.","error.command":"Opdracht mislukt of niet bevestigd. Controleer het fysieke slot voordat je het opnieuw probeert.","error.lock_entity":"Selecteer een slotentiteit.","error.sensor_entity":"{field} moet een sensorentiteit zijn.","editor.entity":"Slot","editor.name":"Weergavenaam","editor.battery_entity":"Batterijsensor (optioneel)","editor.signal_entity":"Wifi-signaalsensor (optioneel)","editor.language":"Taal","editor.automatic":"Taal van Home Assistant gebruiken","description":"Slotbediening, gemelde status, batterij en wifi-signaal.","editor.compact":"Compacte indeling","error.compact":"Compacte modus moet true of false zijn.","description.compact":"Compacte slotbediening, status, batterij en wifi.","error.command_timeout":"De bevestiging van de DESLOC-opdracht duurde te lang. Controleer het slot voordat u opnieuw probeert.","error.command_unconfirmed":"DESLOC heeft de opdracht bevestigd, maar de nieuwe slotstatus is niet bevestigd. Controleer het slot voordat u opnieuw probeert.","error.auth_required":"De DESLOC-authenticatie vereist aandacht. Log opnieuw in via Home Assistant.","error.unavailable":"De slotintegratie is niet beschikbaar. Er zijn geen wijzigingen geprobeerd. Herstel eerst de verbinding.","error.command_in_progress":"Er loopt al een andere opdracht voor dit slot. Er zijn geen wijzigingen geprobeerd. Wacht tot deze klaar is voordat u een nieuw verzoek start."},"pl":{"state.locked":"Zablokowany","state.unlocked":"Odblokowany","state.locking":"Blokowanie…","state.unlocking":"Odblokowywanie…","state.jammed":"Zacięty","state.unknown":"Nieznany","state.unavailable":"Niedostępny","caption":"Zgłoszony stan zamka","details":"Pokaż szczegóły zamka","action.lock":"Zablokuj","action.unlock":"Odblokuj","metric.battery":"Bateria: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"Odblokować „{name}”? Spowoduje to wysłanie polecenia fizycznego odblokowania zamka.","error.command":"Polecenie nie powiodło się lub nie zostało potwierdzone. Przed ponowną próbą sprawdź fizyczny zamek.","error.lock_entity":"Wybierz encję zamka.","error.sensor_entity":"{field} musi być encją czujnika.","editor.entity":"Zamek","editor.name":"Wyświetlana nazwa","editor.battery_entity":"Czujnik baterii (opcjonalny)","editor.signal_entity":"Czujnik sygnału Wi-Fi (opcjonalny)","editor.language":"Język","editor.automatic":"Użyj języka Home Assistant","description":"Sterowanie zamkiem, zgłoszony stan, bateria i sygnał Wi-Fi.","editor.compact":"Układ kompaktowy","error.compact":"Tryb kompaktowy musi mieć wartość true lub false.","description.compact":"Kompaktowe sterowanie zamkiem, stan, bateria i Wi-Fi.","error.command_timeout":"Upłynął czas oczekiwania na potwierdzenie polecenia DESLOC. Sprawdź zamek przed ponowną próbą.","error.command_unconfirmed":"DESLOC potwierdził polecenie, ale nowy stan zamka nie jest potwierdzony. Sprawdź zamek przed ponowną próbą.","error.auth_required":"Uwierzytelnianie DESLOC wymaga uwagi. Zaloguj się ponownie w Home Assistant.","error.unavailable":"Integracja zamka jest niedostępna. Nie próbowano wprowadzać zmian. Najpierw przywróć połączenie.","error.command_in_progress":"Dla tego zamka trwa już inne polecenie. Nie próbowano wprowadzać zmian. Poczekaj na zakończenie przed nowym żądaniem."},"pt":{"state.locked":"Trancado","state.unlocked":"Destrancado","state.locking":"A trancar…","state.unlocking":"A destrancar…","state.jammed":"Encravado","state.unknown":"Desconhecido","state.unavailable":"Indisponível","caption":"Estado comunicado da fechadura","details":"Mostrar detalhes da fechadura","action.lock":"Trancar","action.unlock":"Destrancar","metric.battery":"Bateria: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"Destrancar «{name}»? Isto envia um comando para destrancar fisicamente a fechadura.","error.command":"O comando falhou ou não foi confirmado. Verifique a fechadura física antes de tentar novamente.","error.lock_entity":"Selecione uma entidade de fechadura.","error.sensor_entity":"{field} tem de ser uma entidade de sensor.","editor.entity":"Fechadura","editor.name":"Nome apresentado","editor.battery_entity":"Sensor de bateria (opcional)","editor.signal_entity":"Sensor de sinal Wi-Fi (opcional)","editor.language":"Idioma","editor.automatic":"Usar o idioma do Home Assistant","description":"Controlo da fechadura, estado comunicado, bateria e sinal Wi-Fi.","editor.compact":"Layout compacto","error.compact":"O modo compacto deve ser true ou false.","description.compact":"Controlos compactos da fechadura, estado, bateria e Wi-Fi.","error.command_timeout":"O tempo de confirmação do comando DESLOC esgotou-se. Verifique a fechadura antes de repetir.","error.command_unconfirmed":"DESLOC confirmou o comando, mas o novo estado da fechadura não está confirmado. Verifique a fechadura antes de repetir.","error.auth_required":"A autenticação DESLOC requer atenção. Autentique-se novamente no Home Assistant.","error.unavailable":"A integração da fechadura está indisponível. Não foram tentadas alterações. Restabeleça primeiro a ligação.","error.command_in_progress":"Já está em curso outro comando para esta fechadura. Não foram tentadas alterações. Aguarde que termine antes de iniciar outro pedido."},"ru":{"state.locked":"Заблокирован","state.unlocked":"Разблокирован","state.locking":"Блокируется…","state.unlocking":"Разблокируется…","state.jammed":"Заклинило","state.unknown":"Неизвестно","state.unavailable":"Недоступен","caption":"Сообщённое состояние замка","details":"Показать сведения о замке","action.lock":"Заблокировать","action.unlock":"Разблокировать","metric.battery":"Батарея: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"Разблокировать «{name}»? Будет отправлена команда разблокировки физического замка.","error.command":"Команда не выполнена или не подтверждена. Перед повторной попыткой проверьте физический замок.","error.lock_entity":"Выберите сущность замка.","error.sensor_entity":"{field} должен быть сущностью датчика.","editor.entity":"Замок","editor.name":"Отображаемое имя","editor.battery_entity":"Датчик батареи (необязательно)","editor.signal_entity":"Датчик сигнала Wi-Fi (необязательно)","editor.language":"Язык","editor.automatic":"Использовать язык Home Assistant","description":"Управление замком, сообщённое состояние, батарея и сигнал Wi-Fi.","editor.compact":"Компактный вид","error.compact":"Значение компактного режима должно быть true или false.","description.compact":"Компактное управление замком, состояние, заряд и Wi-Fi.","error.command_timeout":"Истекло время ожидания подтверждения команды DESLOC. Проверьте замок перед повтором.","error.command_unconfirmed":"DESLOC подтвердил команду, но новое состояние замка не подтверждено. Проверьте замок перед повтором.","error.auth_required":"Авторизация DESLOC требует внимания. Авторизуйтесь заново в Home Assistant.","error.unavailable":"Интеграция замка недоступна. Попыток изменения не было. Сначала восстановите подключение.","error.command_in_progress":"Для этого замка уже выполняется команда. Попыток изменения не было. Дождитесь завершения перед новым запросом."},"th":{"state.locked":"ล็อกแล้ว","state.unlocked":"ปลดล็อกแล้ว","state.locking":"กำลังล็อก…","state.unlocking":"กำลังปลดล็อก…","state.jammed":"ติดขัด","state.unknown":"ไม่ทราบ","state.unavailable":"ไม่พร้อมใช้งาน","caption":"สถานะล็อกที่รายงาน","details":"แสดงรายละเอียดล็อก","action.lock":"ล็อก","action.unlock":"ปลดล็อก","metric.battery":"แบตเตอรี่: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"ปลดล็อก “{name}” หรือไม่? การดำเนินการนี้จะส่งคำสั่งปลดล็อกตัวล็อกจริง","error.command":"คำสั่งล้มเหลวหรือยังไม่ได้รับการยืนยัน ตรวจสอบตัวล็อกจริงก่อนลองอีกครั้ง","error.lock_entity":"เลือกเอนทิตีล็อก","error.sensor_entity":"{field} ต้องเป็นเอนทิตีเซ็นเซอร์","editor.entity":"ล็อก","editor.name":"ชื่อที่แสดง","editor.battery_entity":"เซ็นเซอร์แบตเตอรี่ (ไม่บังคับ)","editor.signal_entity":"เซ็นเซอร์สัญญาณ Wi-Fi (ไม่บังคับ)","editor.language":"ภาษา","editor.automatic":"ใช้ภาษาของ Home Assistant","description":"ควบคุมล็อก สถานะที่รายงาน แบตเตอรี่ และสัญญาณ Wi-Fi","editor.compact":"รูปแบบกะทัดรัด","error.compact":"โหมดกะทัดรัดต้องมีค่าเป็น true หรือ false","description.compact":"ตัวควบคุมล็อก สถานะ แบตเตอรี่ และ Wi-Fi แบบกะทัดรัด","error.command_timeout":"หมดเวลารอการยืนยันคำสั่ง DESLOC ตรวจสอบล็อกก่อนลองอีกครั้ง","error.command_unconfirmed":"DESLOC รับทราบคำสั่งแล้ว แต่ยังไม่ยืนยันสถานะใหม่ของล็อก ตรวจสอบล็อกก่อนลองอีกครั้ง","error.auth_required":"การยืนยันตัวตน DESLOC ต้องได้รับการแก้ไข โปรดยืนยันตัวตนใหม่ใน Home Assistant","error.unavailable":"การเชื่อมต่อระบบล็อกไม่พร้อมใช้งาน ยังไม่ได้พยายามเปลี่ยนแปลงใดๆ โปรดกู้คืนการเชื่อมต่อก่อน","error.command_in_progress":"มีคำสั่งอื่นกำลังทำงานกับล็อกนี้ ยังไม่ได้พยายามเปลี่ยนแปลงใดๆ รอให้เสร็จก่อนเริ่มคำขอใหม่"},"tr":{"state.locked":"Kilitli","state.unlocked":"Kilidi açık","state.locking":"Kilitleniyor…","state.unlocking":"Kilit açılıyor…","state.jammed":"Sıkışmış","state.unknown":"Bilinmiyor","state.unavailable":"Kullanılamıyor","caption":"Bildirilen kilit durumu","details":"Kilit ayrıntılarını göster","action.lock":"Kilitle","action.unlock":"Kilidi aç","metric.battery":"Pil: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"“{name}” kilidi açılsın mı? Bu işlem fiziksel kilidi açma komutu gönderir.","error.command":"Komut başarısız oldu veya onaylanmadı. Yeniden denemeden önce fiziksel kilidi kontrol edin.","error.lock_entity":"Bir kilit varlığı seçin.","error.sensor_entity":"{field} bir sensör varlığı olmalıdır.","editor.entity":"Kilit","editor.name":"Görünen ad","editor.battery_entity":"Pil sensörü (isteğe bağlı)","editor.signal_entity":"Wi-Fi sinyal sensörü (isteğe bağlı)","editor.language":"Dil","editor.automatic":"Home Assistant dilini kullan","description":"Kilit kontrolü, bildirilen durum, pil ve Wi-Fi sinyali.","editor.compact":"Kompakt düzen","error.compact":"Kompakt mod true veya false olmalıdır.","description.compact":"Kompakt kilit denetimleri, durum, pil ve Wi-Fi.","error.command_timeout":"DESLOC komut onayı zaman aşımına uğradı. Yeniden denemeden önce kilidi kontrol edin.","error.command_unconfirmed":"DESLOC komutu onayladı ancak yeni kilit durumu doğrulanmadı. Yeniden denemeden önce kilidi kontrol edin.","error.auth_required":"DESLOC kimlik doğrulaması ilgilenmenizi gerektiriyor. Home Assistant’ta yeniden giriş yapın.","error.unavailable":"Kilit entegrasyonu kullanılamıyor. Hiçbir değişiklik denenmedi. Önce bağlantıyı düzeltin.","error.command_in_progress":"Bu kilit için başka bir komut sürüyor. Hiçbir değişiklik denenmedi. Yeni istekten önce bitmesini bekleyin."},"uk":{"state.locked":"Заблоковано","state.unlocked":"Розблоковано","state.locking":"Блокування…","state.unlocking":"Розблокування…","state.jammed":"Заклинило","state.unknown":"Невідомо","state.unavailable":"Недоступно","caption":"Повідомлений стан замка","details":"Показати відомості про замок","action.lock":"Заблокувати","action.unlock":"Розблокувати","metric.battery":"Батарея: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"Розблокувати «{name}»? Буде надіслано команду розблокування фізичного замка.","error.command":"Команду не виконано або не підтверджено. Перед повторною спробою перевірте фізичний замок.","error.lock_entity":"Виберіть сутність замка.","error.sensor_entity":"{field} має бути сутністю датчика.","editor.entity":"Замок","editor.name":"Відображувана назва","editor.battery_entity":"Датчик батареї (необов’язково)","editor.signal_entity":"Датчик сигналу Wi-Fi (необов’язково)","editor.language":"Мова","editor.automatic":"Використовувати мову Home Assistant","description":"Керування замком, повідомлений стан, батарея та сигнал Wi-Fi.","editor.compact":"Компактний вигляд","error.compact":"Значення компактного режиму має бути true або false.","description.compact":"Компактне керування замком, стан, заряд і Wi-Fi.","error.command_timeout":"Час очікування підтвердження команди DESLOC минув. Перевірте замок перед повторною спробою.","error.command_unconfirmed":"DESLOC підтвердив команду, але новий стан замка не підтверджено. Перевірте замок перед повторною спробою.","error.auth_required":"Авторизація DESLOC потребує уваги. Авторизуйтеся знову в Home Assistant.","error.unavailable":"Інтеграція замка недоступна. Спроб змін не було. Спочатку відновіть з’єднання.","error.command_in_progress":"Для цього замка вже виконується інша команда. Спроб змін не було. Дочекайтеся завершення перед новим запитом."},"vi":{"state.locked":"Đã khóa","state.unlocked":"Đã mở khóa","state.locking":"Đang khóa…","state.unlocking":"Đang mở khóa…","state.jammed":"Bị kẹt","state.unknown":"Không rõ","state.unavailable":"Không khả dụng","caption":"Trạng thái do khóa báo cáo","details":"Hiển thị chi tiết khóa","action.lock":"Khóa","action.unlock":"Mở khóa","metric.battery":"Pin: {value}","metric.signal":"Wi-Fi: {value}","confirm.unlock":"Mở khóa “{name}”? Thao tác này gửi lệnh mở khóa thiết bị thực tế.","error.command":"Lệnh thất bại hoặc chưa được xác nhận. Kiểm tra khóa thực tế trước khi thử lại.","error.lock_entity":"Chọn một thực thể khóa.","error.sensor_entity":"{field} phải là một thực thể cảm biến.","editor.entity":"Khóa","editor.name":"Tên hiển thị","editor.battery_entity":"Cảm biến pin (tùy chọn)","editor.signal_entity":"Cảm biến tín hiệu Wi-Fi (tùy chọn)","editor.language":"Ngôn ngữ","editor.automatic":"Sử dụng ngôn ngữ của Home Assistant","description":"Điều khiển khóa, trạng thái báo cáo, pin và tín hiệu Wi-Fi.","editor.compact":"Bố cục gọn","error.compact":"Chế độ gọn phải là true hoặc false.","description.compact":"Điều khiển khóa gọn, trạng thái, pin và Wi-Fi.","error.command_timeout":"Hết thời gian chờ xác nhận lệnh DESLOC. Kiểm tra khóa trước khi thử lại.","error.command_unconfirmed":"DESLOC đã ghi nhận lệnh nhưng chưa xác nhận trạng thái khóa mới. Kiểm tra khóa trước khi thử lại.","error.auth_required":"Xác thực DESLOC cần được xử lý. Hãy xác thực lại trong Home Assistant.","error.unavailable":"Tích hợp khóa không khả dụng. Chưa thử thay đổi gì. Hãy khôi phục kết nối trước.","error.command_in_progress":"Một lệnh khác đang chạy cho khóa này. Chưa thử thay đổi gì. Đợi hoàn tất trước khi gửi yêu cầu mới."},"zh-Hans":{"state.locked":"已上锁","state.unlocked":"已解锁","state.locking":"正在上锁…","state.unlocking":"正在解锁…","state.jammed":"卡住","state.unknown":"未知","state.unavailable":"不可用","caption":"上报的锁状态","details":"显示锁的详细信息","action.lock":"上锁","action.unlock":"解锁","metric.battery":"电池：{value}","metric.signal":"Wi-Fi：{value}","confirm.unlock":"要解锁“{name}”吗？这将发送指令，解锁实际门锁。","error.command":"指令失败或未获确认。重试前请检查实际门锁。","error.lock_entity":"请选择锁实体。","error.sensor_entity":"{field} 必须是传感器实体。","editor.entity":"锁","editor.name":"显示名称","editor.battery_entity":"电池传感器（可选）","editor.signal_entity":"Wi-Fi 信号传感器（可选）","editor.language":"语言","editor.automatic":"使用 Home Assistant 的语言","description":"锁控制、上报状态、电池和 Wi-Fi 信号。","editor.compact":"紧凑布局","error.compact":"紧凑模式必须为 true 或 false。","description.compact":"紧凑的门锁控制、状态、电池和 Wi-Fi。","error.command_timeout":"等待 DESLOC 命令确认超时。重试前请检查锁。","error.command_unconfirmed":"DESLOC 已确认接收命令，但新锁状态尚未确认。重试前请检查锁。","error.auth_required":"DESLOC 认证需要处理。请在 Home Assistant 中重新认证。","error.unavailable":"锁集成不可用。未尝试进行任何更改。请先恢复连接。","error.command_in_progress":"此锁已有其他命令正在执行。未尝试进行更改。请等待完成后再发起新请求。"},"zh-Hant":{"state.locked":"已上鎖","state.unlocked":"已解鎖","state.locking":"正在上鎖…","state.unlocking":"正在解鎖…","state.jammed":"卡住","state.unknown":"未知","state.unavailable":"無法使用","caption":"回報的鎖定狀態","details":"顯示鎖的詳細資訊","action.lock":"上鎖","action.unlock":"解鎖","metric.battery":"電池：{value}","metric.signal":"Wi-Fi：{value}","confirm.unlock":"要解鎖「{name}」嗎？這將傳送指令，解鎖實際門鎖。","error.command":"指令失敗或未獲確認。重試前請檢查實際門鎖。","error.lock_entity":"請選擇鎖實體。","error.sensor_entity":"{field} 必須是感測器實體。","editor.entity":"鎖","editor.name":"顯示名稱","editor.battery_entity":"電池感測器（選填）","editor.signal_entity":"Wi-Fi 訊號感測器（選填）","editor.language":"語言","editor.automatic":"使用 Home Assistant 的語言","description":"鎖控制、回報狀態、電池和 Wi-Fi 訊號。","editor.compact":"精簡版面配置","error.compact":"精簡模式必須為 true 或 false。","description.compact":"精簡的門鎖控制、狀態、電池和 Wi-Fi。","error.command_timeout":"等待 DESLOC 指令確認逾時。重試前請檢查鎖。","error.command_unconfirmed":"DESLOC 已確認收到指令，但新的鎖狀態尚未確認。重試前請檢查鎖。","error.auth_required":"DESLOC 驗證需要處理。請在 Home Assistant 中重新驗證。","error.unavailable":"鎖整合無法使用。未嘗試進行任何變更。請先恢復連線。","error.command_in_progress":"此鎖已有其他指令正在執行。未嘗試進行變更。請等待完成後再發起新要求。"}}).map(([code, messages]) => [code, Object.freeze(messages)])));
// END GENERATED I18N
const STATES = new Set(["locked", "unlocked", "locking", "unlocking", "jammed", "unknown", "unavailable"]);
const COMMAND_ERROR_KEYS = new Set(["command_timeout", "command_unconfirmed", "auth_required", "unavailable", "command_in_progress"]);
const RECOVERABLE_COMMAND_ERRORS = new Set(["command_timeout", "command_unconfirmed", "command_failed"]);
const UNCERTAIN_STATES = new Set(["unknown", "locking", "unlocking"]);
const localeCodes = new Map(LOCALES.map(({ code }) => [code.toLowerCase(), code]));

function stateChangedAt(state) {
  if (typeof state?.last_changed !== "string") return null;
  const timestamp = Date.parse(state.last_changed);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function resolveLocale(value) {
  if (typeof value !== "string") return null;
  const code = value.trim().replaceAll("_", "-").toLowerCase();
  if (localeCodes.has(code)) return localeCodes.get(code);
  if (/^zh(?:-|$)/.test(code)) {
    if (/(?:^|-)hans(?:-|$)/.test(code)) return "zh-Hans";
    return /(?:^|-)(?:hant|tw|hk|mo)(?:-|$)/.test(code) ? "zh-Hant" : "zh-Hans";
  }
  return localeCodes.get(code.split("-")[0]) || null;
}

export function translate(locale, key, values = {}) {
  const dictionary = MESSAGES[resolveLocale(locale) || "en"];
  const message = Object.hasOwn(dictionary, key) ? dictionary[key] : Object.hasOwn(MESSAGES.en, key) ? MESSAGES.en[key] : key;
  // One pass only: user text can contain braces and must never become a template.
  return message.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (match, name) => Object.hasOwn(values, name) ? String(values[name]) : match);
}

function selectedLocale(config, hass) {
  // An explicit unsupported override falls back to English rather than silently
  // selecting a different language. "auto" is also accepted in hand-written YAML.
  const requested = config?.language && config.language !== "auto" ? config.language : hass?.locale?.language || hass?.language;
  return resolveLocale(requested) || "en";
}

function localizeElement(element, config, hass) {
  const locale = selectedLocale(config, hass);
  element.lang = locale;
  element.dir = LOCALES.find(entry => entry.code === locale).dir;
  return (key, values) => translate(locale, key, values);
}

export class DeslocLockCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        :host([data-compact]) { container-type: inline-size; }
        ha-card { padding: 24px; overflow: hidden; color: var(--primary-text-color); background: var(--ha-card-background, var(--card-background-color)); }
        header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        h2 { font-size: 20px; font-weight: 600; margin: 0; overflow-wrap: anywhere; }
        .caption { color: var(--secondary-text-color); font-size: 12px; margin: 5px 0 0; }
        .hero { display: grid; justify-items: center; padding: 24px 0; gap: 14px; }
        .disc { width: 88px; height: 88px; border-radius: 50%; display: grid; place-items: center; background: color-mix(in srgb, var(--primary-color) 12%, transparent); color: var(--primary-color); }
        .disc[data-state="unlocked"] { background: color-mix(in srgb, var(--warning-color, #e6a000) 15%, transparent); color: var(--warning-color, #e6a000); }
        .disc[data-state="unknown"], .disc[data-state="unavailable"] { color: var(--secondary-text-color); background: var(--secondary-background-color); }
        .disc ha-icon { --mdc-icon-size: 42px; }
        .state { font-size: 24px; font-weight: 600; text-align: center; overflow-wrap: anywhere; max-width: 100%; }
        .telemetry { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 0 0 24px; }
        .metric { font-size: 13px; border: 1px solid var(--divider-color); border-radius: 22px; padding: 7px 12px; }
        .metric[hidden] { display: none; }
        .actions { display: grid; grid-template-columns: minmax(0, 1fr); }
        button { overflow-wrap: anywhere; font: inherit; cursor: pointer; border-radius: 12px; min-height: 46px; border: 1px solid var(--divider-color); color: var(--primary-text-color); background: transparent; padding: 10px 16px; }
        button.primary { color: var(--text-primary-color, #fff); background: var(--primary-color); border-color: var(--primary-color); }
        button:disabled { cursor: default; opacity: .45; }
        button:focus-visible { outline: 3px solid var(--primary-color); outline-offset: 3px; }
        button.info { border: 0; min-width: 44px; padding: 8px; }
        .error { color: var(--error-color, #db4437); font-size: 13px; margin-top: 14px; overflow-wrap: anywhere; }
        .error:empty { display: none; }
        ha-card[data-compact] { display: grid; grid-template-columns: 44px minmax(0, 1fr) minmax(64px, auto); gap: 2px 10px; padding: 12px; align-items: center; }
        [data-compact] header, [data-compact] header > div, [data-compact] .hero { display: contents; }
        [data-compact] h2 { grid-column: 2; grid-row: 1; font-size: 16px; line-height: 20px; }
        [data-compact] .caption { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
        [data-compact] .info { grid-column: 1; grid-row: 1 / 4; width: 44px; height: 44px; min-height: 44px; padding: 8px; border-radius: 50%; color: var(--primary-color); background: color-mix(in srgb, var(--primary-color) 12%, transparent); }
        [data-compact] .info[data-state="unlocked"] { color: var(--warning-color, #e6a000); background: color-mix(in srgb, var(--warning-color, #e6a000) 15%, transparent); }
        [data-compact] .info[data-state="unknown"], [data-compact] .info[data-state="unavailable"] { color: var(--secondary-text-color); background: var(--secondary-background-color); }
        [data-compact] .info ha-icon { --mdc-icon-size: 24px; }
        [data-compact] .disc { display: none; }
        [data-compact] .state { grid-column: 2; grid-row: 2; text-align: start; font-size: 14px; line-height: 18px; }
        [data-compact] .telemetry { grid-column: 2; grid-row: 3; justify-content: flex-start; gap: 2px 8px; margin: 0; min-width: 0; }
        [data-compact] .metric { font-size: 11px; line-height: 16px; border: 0; padding: 0; overflow-wrap: anywhere; }
        [data-compact] .actions { grid-column: 3; grid-row: 1 / 4; max-width: 100px; }
        [data-compact] .action { font-size: 14px; padding: 8px; min-height: 44px; }
        [data-compact] .error { grid-column: 1 / -1; margin-top: 8px; }
        @container (max-width: 279px) {
          ha-card[data-compact] { grid-template-columns: 44px minmax(0, 1fr); }
          [data-compact] .info { grid-row: 1 / 3; }
          [data-compact] .telemetry { grid-column: 1 / -1; margin-top: 4px; }
          [data-compact] .actions { grid-column: 1 / -1; grid-row: 4; max-width: none; margin-top: 8px; }
          [data-compact] .error { grid-row: 5; }
        }
        @media (prefers-reduced-motion: no-preference) { .disc { transition: background .2s; } }
      </style>
      <ha-card>
        <header><div><h2></h2><p class="caption">Reported lock state</p></div><button class="info" aria-label="Show lock details"><ha-icon icon="mdi:information-outline"></ha-icon></button></header>
        <div class="hero"><div class="disc"><ha-icon></ha-icon></div><div class="state" role="status" aria-live="polite"></div></div>
        <div class="telemetry"><span class="metric battery"></span><span class="metric signal"></span></div>
        <div class="actions"><button class="primary action" disabled>Unavailable</button></div>
        <div class="error" role="alert"></div>
      </ha-card>`;
    const action = this.shadowRoot.querySelector(".action");
    const rememberActivation = kind => {
      this._activation = { kind, entity: this._config?.entity, ...this._actionPlan() };
    };
    const cancelActivation = () => {
      // Keep a cancelled marker until this gesture's click or a fresh gesture.
      // Clearing it here would let a late click choose the opposite action.
      if (this._activation) this._activation.cancelled = true;
    };
    action.addEventListener("pointerdown", event => {
      if (event.button === 0 && event.isPrimary !== false) rememberActivation("pointer");
    });
    action.addEventListener("pointercancel", cancelActivation);
    action.addEventListener("blur", () => {
      // WebKit may blur a focused button during an ordinary pointer click.
      // Losing keyboard focus cancels a key gesture; pointercancel handles touch.
      if (this._activation?.kind === "keyboard") cancelActivation();
    });
    action.addEventListener("click", event => {
      const activation = this._activation;
      this._activation = undefined;
      // A double-click must not reverse a command that completed between clicks.
      if (event.detail > 1) return;
      const current = this._actionPlan();
      // A press belongs to the action displayed when it began, not a later one.
      if (activation && (activation.cancelled || activation.disabled
        || activation.entity !== this._config?.entity || activation.state !== current.state
        || activation.service !== current.service)) return;
      // Assistive-technology and programmatic clicks can have no preceding press.
      this._command(activation?.service ?? current.service);
    });
    action.addEventListener("keydown", event => {
      // Preserve native keyboard activation, but never repeat a held key.
      if (["Enter", " "].includes(event.key)) {
        if (event.repeat) event.preventDefault();
        else rememberActivation("keyboard");
      } else if (event.key === "Escape") cancelActivation();
    });
    this.shadowRoot.querySelector(".info").addEventListener("click", () => {
      if (this._config) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: this._config.entity }, bubbles: true, composed: true }));
    });
  }

  setConfig(config) {
    const t = key => translate(selectedLocale(config, this._hass), key);
    if (typeof config?.entity !== "string" || !config.entity.startsWith("lock.")) throw new Error(t("error.lock_entity"));
    for (const key of ["battery_entity", "signal_entity"]) {
      if (config[key] && (typeof config[key] !== "string" || !config[key].startsWith("sensor."))) throw new Error(translate(selectedLocale(config, this._hass), "error.sensor_entity", { field: key }));
    }
    if (config.compact !== undefined && typeof config.compact !== "boolean") throw new Error(t("error.compact"));
    if (this._config?.entity !== config.entity) {
      this._error = "";
      this._errorRecovery = null;
    }
    this._config = { ...config };
    this.toggleAttribute("data-compact", this._isCompact());
    this.shadowRoot.querySelector("ha-card").toggleAttribute("data-compact", this._isCompact());
    this._render();
  }

  set hass(value) {
    this._updateErrorRecovery(value);
    this._hass = value;
    this._render();
  }
  get hass() { return this._hass; }
  _isCompact() { return this._config?.compact ?? false; }
  getCardSize() {
    if (!this._isCompact()) return 4;
    const root = this.shadowRoot;
    const measured = root.querySelector("ha-card").getBoundingClientRect().height;
    if (measured > 0) return Math.max(2, Math.ceil(measured / 50));
    // Masonry asks before mounting the card. Estimate a common 320px column
    // from its rendered, localized content; a mounted measurement takes priority.
    // Allow roughly 120px for text beside the icon and action. Count wide CJK
    // characters twice and ignore invisible bidi isolates when estimating wraps.
    const lines = (text, columns) => Math.ceil([...String(text).trim()
      .replace(/[\u2066-\u2069]/g, "")
      .replace(/[\u2e80-\ua4cf\uac00-\ud7af\uf900-\ufaff]/g, "xx")].length / columns);
    const text = selector => root.querySelector(selector).textContent;
    const name = text("h2") || this._config?.name || this._hass?.states?.[this._config?.entity]?.attributes?.friendly_name || this._config?.entity || "";
    const metrics = [...root.querySelectorAll(".metric")].filter(el => !el.hidden).map(el => el.textContent).join("  ");
    const contentHeight = lines(name, 14) * 20 + lines(text(".state"), 16) * 18 + lines(metrics, 22) * 16 + 4;
    const actionHeight = Math.max(44, lines(text(".action"), 10) * 18 + 16);
    const errorLines = lines(text(".error"), 38);
    const estimated = 24 + Math.max(contentHeight, actionHeight) + (errorLines ? 10 + errorLines * 18 : 0);
    return Math.max(2, Math.ceil(estimated / 50));
  }
  getGridOptions() {
    // Content height accommodates narrow sections, translated names and errors.
    if (this._isCompact()) return { columns: 12, rows: "auto", min_columns: 6 };
    return { columns: 6, rows: 5, min_columns: 6, min_rows: 5 };
  }
  static getConfigElement() { return document.createElement("desloc-lock-card-editor"); }
  static getStubConfig(hass, entities, fallbackEntities) {
    const candidates = [...(entities || []), ...(fallbackEntities || []), ...Object.keys(hass?.states || {})];
    const entity = candidates.find(id => id.startsWith("lock.") && /desloc|c100/i.test(`${id} ${hass?.states[id]?.attributes?.friendly_name || ""}`)) || candidates.find(id => id.startsWith("lock.")) || "";
    return { entity };
  }

  _displayName() {
    return this._config.name || this._hass.states[this._config.entity]?.attributes?.friendly_name || this._config.entity;
  }

  _actionPlan() {
    const state = this._hass?.states?.[this._config?.entity]?.state || "unavailable";
    const transitioning = ["locking", "unlocking"].includes(state);
    // Recovery from an uncertain state permits only an explicit lock command.
    const service = state === "locked" ? "unlock" : "lock";
    const label = this._busy ? `state.${this._pendingService}ing`
      : transitioning || state === "unavailable" ? `state.${state}` : `action.${service}`;
    return { state, service, label, disabled: Boolean(this._busy || this._confirming) || transitioning || state === "unavailable" };
  }

  _recordCommandError(error, entity) {
    // A completed request belongs to its original target, even after editing.
    if (this._config?.entity !== entity) return;
    const key = error && typeof error === "object"
      && Object.hasOwn(error, "translation_domain") && error.translation_domain === "desloc"
      && Object.hasOwn(error, "translation_key") && typeof error.translation_key === "string"
      ? error.translation_key : null;
    // Never show raw messages or server placeholders: they can contain secrets.
    this._error = COMMAND_ERROR_KEYS.has(key) ? `error.${key}` : "error.command";
    const state = this._hass?.states?.[entity];
    const failedAt = stateChangedAt(state);
    this._errorRecovery = RECOVERABLE_COMMAND_ERRORS.has(key) && failedAt !== null
      ? { entity, failedAt, uncertainAt: UNCERTAIN_STATES.has(state?.state) ? failedAt : null }
      : null;
  }

  _updateErrorRecovery(hass) {
    const recovery = this._errorRecovery;
    if (!recovery || this._config?.entity !== recovery.entity) return;
    const state = hass?.states?.[recovery.entity];
    const changedAt = stateChangedAt(state);
    if (changedAt === null || changedAt < recovery.failedAt) return;
    if (UNCERTAIN_STATES.has(state?.state)) {
      recovery.uncertainAt = Math.max(recovery.uncertainAt ?? recovery.failedAt, changedAt);
    } else if (["locked", "unlocked"].includes(state?.state)
      && recovery.uncertainAt !== null && changedAt > recovery.uncertainAt) {
      // Only a newer stable report after uncertainty resolves an old warning.
      // Sensor updates, cached state and authentication errors cannot clear it.
      this._error = "";
      this._errorRecovery = null;
    }
  }

  _render() {
    if (!this._config || !this._hass) return;
    const t = localizeElement(this, this._config, this._hass);
    this.shadowRoot.querySelector(".caption").textContent = t("caption");
    this.shadowRoot.querySelector(".info").setAttribute("aria-label", t("details"));
    const plan = this._actionPlan();
    const state = plan.state;
    const action = this.shadowRoot.querySelector(".action");
    action.textContent = t(plan.label);
    action.disabled = plan.disabled;
    action.setAttribute("aria-busy", String(Boolean(this._busy) || ["locking", "unlocking"].includes(state)));
    this.shadowRoot.querySelector("h2").textContent = this._displayName();
    this.shadowRoot.querySelector(".state").textContent = t(`state.${STATES.has(state) ? state : "unknown"}`);
    const disc = this.shadowRoot.querySelector(".disc");
    disc.dataset.state = STATES.has(state) ? state : "unknown";
    const icon = state === "locked" ? "mdi:lock" : state === "unlocked" ? "mdi:lock-open-variant" : "mdi:lock-question";
    disc.querySelector("ha-icon").setAttribute("icon", icon);
    const info = this.shadowRoot.querySelector(".info");
    info.dataset.state = disc.dataset.state;
    info.querySelector("ha-icon").setAttribute("icon", this._isCompact() ? icon : "mdi:information-outline");
    for (const [key, selector, message, unit] of [["battery_entity", ".battery", "metric.battery", "%"], ["signal_entity", ".signal", "metric.signal", " dBm"]]) {
      const el = this.shadowRoot.querySelector(selector);
      const sensor = this._hass.states[this._config[key]];
      el.hidden = !this._config[key];
      const raw = sensor?.state;
      const value = typeof raw === "string" && raw.trim() !== "" && Number.isFinite(Number(raw)) ? raw : null;
      el.textContent = t(message, { value: value === null ? t("state.unavailable") : `\u2068${value + unit}\u2069` });
    }
    this.shadowRoot.querySelector(".error").textContent = this._error ? t(this._error) : "";
  }

  async _command(service) {
    if (!this._config || !this._hass || !["lock", "unlock"].includes(service)) return;
    const plan = this._actionPlan();
    if (plan.disabled || plan.service !== service) return;
    const entity = this._config.entity;
    if (service === "unlock") {
      this._confirming = true;
      try {
        if (!window.confirm(translate(selectedLocale(this._config, this._hass), "confirm.unlock", { name: this._displayName() }))) return;
      } finally {
        this._confirming = false;
        this._render();
      }
    }
    // HA or card configuration may change while the confirmation is open.
    const current = this._actionPlan();
    if (this._config.entity !== entity || current.disabled || current.service !== service || current.state !== plan.state) return;
    this._busy = true;
    this._pendingService = service;
    this._error = "";
    this._errorRecovery = null;
    this._render();
    try {
      await this._hass.callService("lock", service, { entity_id: entity });
    } catch (error) {
      this._recordCommandError(error, entity);
    } finally {
      this._busy = false;
      this._pendingService = undefined;
      this._render();
    }
  }
}

// Both picker entries share the same rendering, command guards and resource.
export class DeslocCompactLockCard extends DeslocLockCard {
  _isCompact() { return this._config?.compact ?? true; }
  static getStubConfig(...args) { return { ...super.getStubConfig(...args), compact: true }; }
}

export class DeslocLockCardEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  setConfig(config) { this._config = { ...config }; this._render(); }
  set hass(value) { this._hass = value; this._render(); }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", event => {
        event.stopPropagation();
        this._config = { ...this._config, ...event.detail.value };
        if (this._config.language === "auto") delete this._config.language;
        this._render();
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.shadowRoot.append(this._form);
    }
    const t = localizeElement(this, this._config, this._hass);
    this._form.schema = [
      { name: "entity", required: true, selector: { entity: { domain: "lock" } } },
      { name: "name", selector: { text: {} } },
      { name: "compact", selector: { boolean: {} } },
      { name: "battery_entity", selector: { entity: { domain: "sensor", device_class: "battery" } } },
      { name: "signal_entity", selector: { entity: { domain: "sensor", device_class: "signal_strength" } } },
      { name: "language", selector: { select: { mode: "dropdown", options: [{ value: "auto", label: t("editor.automatic") }, ...LOCALES.map(({ code, name }) => ({ value: code, label: name }))] } } },
    ];
    this._form.computeLabel = ({ name }) => t(`editor.${name}`);
    this._form.hass = this._hass;
    this._form.data = { ...this._config, compact: this._config.compact ?? this._config.type === "custom:desloc-compact-lock-card", language: this._config.language || "auto" };
  }
}

if (!customElements.get("desloc-lock-card")) customElements.define("desloc-lock-card", DeslocLockCard);
if (!customElements.get("desloc-compact-lock-card")) customElements.define("desloc-compact-lock-card", DeslocCompactLockCard);
if (!customElements.get("desloc-lock-card-editor")) customElements.define("desloc-lock-card-editor", DeslocLockCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === "desloc-lock-card")) window.customCards.push({ type: "desloc-lock-card", name: "DESLOC Lock Card", description: translate(globalThis.navigator?.language, "description"), preview: true });
if (!window.customCards.some(card => card.type === "desloc-compact-lock-card")) window.customCards.push({ type: "desloc-compact-lock-card", name: "DESLOC Compact Lock Card", description: translate(globalThis.navigator?.language, "description.compact"), preview: true });
console.info(`DESLOC Lock Card ${VERSION}`);
