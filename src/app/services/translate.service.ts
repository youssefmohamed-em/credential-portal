// src/app/core/services/translation.service.ts
import { Injectable, signal, effect, computed, LOCALE_ID } from '@angular/core';

export type Lang = 'en' | 'ar';
export type Dir = 'ltr' | 'rtl';

type Dict = Record<Lang, Record<string, string>>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly STORAGE_LANG = 'lang';
  private readonly STORAGE_DIR = 'dir';

  private initialLang = (localStorage.getItem(this.STORAGE_LANG) as Lang) || 'en';
  private initialDir: Dir =
    (localStorage.getItem(this.STORAGE_DIR) as Dir) ||
    (this.initialLang === 'ar' ? 'rtl' : 'ltr');

  lang = signal<Lang>(this.initialLang);
  dir = signal<Dir>(this.initialDir);

  private dict: Dict = {
    en: {



      // Products
      'PRODUCTS.TITLE': 'Products',
      'PRODUCTS.DESCRIPTION': 'Manage Your Products',
      'PRODUCTS.ADD': 'Add Product',
      'PRODUCTS.WEIGHT': 'Weight',
      'PRODUCTS.PRICE': 'Price',
      'PRODUCTS.LIVE_GOLD_PRICE': 'Live Gold Price',
      'PRODUCTS.CALCULATED_PRICE': 'Calculated Price',
      'PRODUCTS.NOT_SPECIFIED': 'Not Specified',
      'PRODUCTS.EMPTY': 'No Products Available',
      'PRODUCTS.REFERENCE': 'Product Reference',
      'PRODUCTS.BARCODE': 'Barcode',
      'PRODUCTS.PURITY': 'Purity',
      'PRODUCTS.BASE_PRICE_FORMULA': 'Base Price Formula',
      'PRODUCTS.BOX_BARCODE': 'Box Barcode',
      'PRODUCTS.EDIT': 'Edit Product',
      'PRODUCTS.DELETE': 'Delete Product',
      'PRODUCTS.SAVING': 'Saving...',
      'PRODUCTS.CREATED': 'Product created successfully.',
      'PRODUCTS.UPDATED': 'Product updated successfully.',
      'PRODUCTS.DELETED': 'Product deleted successfully.',
      'PRODUCTS.DELETE_CONFIRM': 'Are you sure you want to delete this product?',
      'PRODUCTS.SELECT_REFERENCE': 'Select a product reference',
      'PRODUCTS.LOADING_REFERENCES': 'Loading product references...',
      'PRODUCTS.NO_REFERENCES': 'No products are available.',
      'PRODUCTS.NAME': 'Product Name',
      'PRODUCTS.CATEGORY': 'Category',
      'PRODUCTS.TYPE': 'Product Type',


      //sidebar

      'SIDEBAR.PRODUCTS': 'Products',
      'SIDEBAR.MACHINES': 'Machines',
      'SIDEBAR.LOGOUT': 'Log Out',
      'SIDEBAR.COLLAPSE': 'Collapse',
      'SIDEBAR.REPORTS':'Reports',



      // Forgot Password
      'FORGOT_PASSWORD.TITLE': 'Forgot Password',
      'FORGOT_PASSWORD.DESCRIPTION':
        'Enter your username to receive instructions to reset your password.',
      'FORGOT_PASSWORD.USERNAME_LABEL': 'Username',
      'FORGOT_PASSWORD.USERNAME_PLACEHOLDER': 'Enter your username',
      'FORGOT_PASSWORD.USERNAME_REQUIRED': 'Username is required',
      'FORGOT_PASSWORD.SUBMIT': 'Send Reset Instructions',
      'FORGOT_PASSWORD.SENDING': 'Sending...',
      'FORGOT_PASSWORD.SUCCESS_TITLE': 'Reset Instructions Sent',
      'FORGOT_PASSWORD.SUCCESS_MESSAGE':
        'Reset instructions have been sent to',
      'FORGOT_PASSWORD.SUCCESS_SUFFIX':
        '. Please check your account for further instructions.',
      'FORGOT_PASSWORD.BACK_TO_LOGIN': 'Back to Login',

      // Machines
      'MACHINES.TITLE': 'Machines',
      'MACHINES.ADD': 'Add Machine',
      'MACHINES.ID': 'ID',
      'MACHINES.LOCATION': 'Location',
      'MACHINES.REGISTERED_AT': 'Registered At',
      'MACHINES.STATUS': 'Status',

      'MACHINES.CREATE.TITLE': 'Add Machine',
      'MACHINES.CREATE.CODE': 'Machine Code',
      'MACHINES.CREATE.LOCATION': 'Location',
      'MACHINES.CREATE.CODE_PLACEHOLDER': 'e.g. MC-001',
      'MACHINES.CREATE.LOCATION_PLACEHOLDER': 'e.g. Warehouse A',
      'MACHINES.CREATE.SAVE': 'Save',
      'MACHINES.CREATE.SAVING': 'Saving...',
      'MACHINES.CREATE.REQUIRED': 'Machine code and location are required.',
      'MACHINES.CREATE.SUCCESS': 'Machine created successfully.',
      'MACHINES.CREATE.FAILED': 'Failed to create machine. Please try again.',

      'MACHINES.TOGGLE.TITLE': 'Toggle Machine Status',
      'MACHINES.TOGGLE.SUBTITLE': 'Confirm machine status update',
      'MACHINES.TOGGLE.MESSAGE': 'Are you sure you want to change the machine status?',
      'MACHINES.TOGGLE.DESCRIPTION': 'This action will update the machine status immediately.',
      'MACHINES.TOGGLE.CONFIRM': 'Confirm',
      'MACHINES.TOGGLE.UPDATING': 'Updating...',
      'MACHINES.TOGGLE.SUCCESS': 'Machine status updated successfully.',
      'MACHINES.TOGGLE.FAILED': 'Failed to update machine status.',

      'MACHINES.COMMAND.TITLE': 'Send Machine Command',
      'MACHINES.COMMAND.SUBTITLE': 'Select a command to send to the machine',
      'MACHINES.COMMAND.SELECT': 'Select Command',

      'MACHINES.COMMAND.RESTART': 'Restart Machine',
      'MACHINES.COMMAND.FORCE_OFFLINE': 'Force Offline',
      'MACHINES.COMMAND.REQUEST_DIAGNOSTICS': 'Request Diagnostics',
      'MACHINES.COMMAND.DISPENSE_TEST': 'Dispense Test',

      'MACHINES.COMMAND.WARNING':
        'This command will be sent immediately to the selected machine.',

      'MACHINES.COMMAND.SENDING': 'Sending...',
      'MACHINES.COMMAND.SEND': 'Send Command',

      'MACHINES.COMMAND.SUCCESS':
        'Command sent successfully.',

      'MACHINES.COMMAND.FAILED':
        'Failed to send command. Please try again.',


      'COMMON.CANCEL': 'Cancel',
      'COMMON.SAVE': 'Save',
      'COMMON.CONFIRM': 'Confirm',
      'COMMON.SUCCESS': 'Success',
      'COMMON.ERROR': 'Error',
      'COMMON.REFRESH': 'Refresh',
      //dashboard
      'DASHBOARD': 'Dashboard',

      // Login
      'LOGIN.SIGN_IN': 'Sign In',
      'LOGIN.WELCOME': 'Welcome Back',
      'LOGIN.WELCOME_MESSAGE':
        'Please sign in to access your account',

      'LOGIN.EMAIL': 'Email Address',
      'LOGIN.EMAIL_PLACEHOLDER':
        'name@example.com',

      'LOGIN.PASSWORD': 'Password',
      'LOGIN.PASSWORD_PLACEHOLDER':
        '••••••••',

      'LOGIN.FORGOT_PASSWORD':
        'Forgot your password?',

      'LOGIN.SIGNING_IN':
        'Signing in...',

      'LOGIN.LOGIN_BUTTON':
        'Sign In',

      'LOGIN.EMAIL_REQUIRED':
        'Email is required',

      'LOGIN.EMAIL_INVALID':
        'Invalid email address',

      'LOGIN.PASSWORD_REQUIRED':
        'Password is required',

      'LOGIN.PASSWORD_MIN_LENGTH':
        'Password must be at least 6 characters',

      // Machines Table Columns
      'ID': 'ID',
      'LOCATION': 'Location',
      'REGISTERED_AT': 'Registered At',
      'STATUS': 'Status',

      //Shared Table
      'TABLE.NO_DATA': 'No data available',
      'TABLE.SHOWING': 'Showing',
      'TABLE.TO': 'to',
      'TABLE.OF': 'of',
      'TABLE.RESULTS': 'results',

      'TABLE.ACTIONS': 'Actions',
      'TABLE.SEARCH': 'Search...',
      'TABLE.SELECT': 'Select...',
      'TABLE.PREVIOUS': 'Previous',
      'TABLE.NEXT': 'Next',
      'TABLE.ROWS_PER_PAGE': 'Rows per page',

      'TABLE.MENU': 'More Actions',


      // Reports
'REPORTS.TITLE': 'Reports',
'REPORTS.DESCRIPTION': 'Finance & Compliance overview',

'REPORTS.FINANCE.TITLE': 'Finance',
'REPORTS.FINANCE.DESCRIPTION': 'Payment and revenue overview',
'REPORTS.FINANCE.PAID_ORDERS': 'Paid Orders',
'REPORTS.FINANCE.PAID_ORDERS_DESCRIPTION': 'Successfully paid orders',
'REPORTS.FINANCE.TOTAL_PAID_AMOUNT': 'Total Paid Amount',
'REPORTS.FINANCE.TOTAL_PAID_AMOUNT_DESCRIPTION': 'Total amount received',

'REPORTS.COMPLIANCE.TITLE': 'Compliance',
'REPORTS.COMPLIANCE.DESCRIPTION': 'Customer verification overview',
'REPORTS.COMPLIANCE.VERIFIED_CUSTOMERS': 'Verified Customers',
'REPORTS.COMPLIANCE.VERIFIED_DESCRIPTION': 'Successfully verified',
'REPORTS.COMPLIANCE.REJECTED_CUSTOMERS': 'Rejected Customers',
'REPORTS.COMPLIANCE.REJECTED_DESCRIPTION': 'Verification rejected',
'REPORTS.COMPLIANCE.MANUAL_REVIEW': 'Manual Review',
'REPORTS.COMPLIANCE.MANUAL_REVIEW_DESCRIPTION': 'Require manual review',

'REPORTS.GENERATED': 'Generated',


      // Language
      'LANGUAGE.CHANGE':
        'Change language',

      // Messages
      'MESSAGES.SUCCESS':
        'Success',

      'MESSAGES.LOGIN_SUCCESS':
        'Welcome back',

      'MESSAGES.ERROR':
        'Error',

      // Footer
      'FOOTER.COPYRIGHT':
        '© 2026 Gold Era. All Rights Reserved.'



    },

    ar: {
      'PRODUCTS.NAME': 'اسم المنتج',
      'PRODUCTS.CATEGORY': 'الفئة',
      'PRODUCTS.TYPE': 'نوع المنتج',
      'PRODUCTS.NO_REFERENCES': 'لا توجد منتجات متاحة.',
      'PRODUCTS.SELECT_REFERENCE': 'اختر مرجع المنتج',
      'PRODUCTS.LOADING_REFERENCES': 'جارٍ تحميل مراجع المنتجات...',
      'PRODUCTS.REFERENCE': 'مرجع المنتج',
      'PRODUCTS.BARCODE': 'الباركود',
      'PRODUCTS.PURITY': 'النقاء',
      'PRODUCTS.BASE_PRICE_FORMULA': 'معادلة السعر الأساسي',
      'PRODUCTS.BOX_BARCODE': 'باركود الصندوق',
      'PRODUCTS.EDIT': 'تعديل المنتج',
      'PRODUCTS.DELETE': 'حذف المنتج',
      'PRODUCTS.SAVING': 'جارٍ الحفظ...',
      'PRODUCTS.CREATED': 'تم إنشاء المنتج بنجاح.',
      'PRODUCTS.UPDATED': 'تم تعديل المنتج بنجاح.',
      'PRODUCTS.DELETED': 'تم حذف المنتج بنجاح.',
      'PRODUCTS.DELETE_CONFIRM': 'هل أنت متأكد من حذف هذا المنتج؟',


      // Products
      'PRODUCTS.TITLE': 'المنتجات',
      'PRODUCTS.DESCRIPTION': 'إدارة المنتجات',
      'PRODUCTS.ADD': 'إضافة منتج',
      'PRODUCTS.WEIGHT': 'الوزن',
      'PRODUCTS.PRICE': 'السعر',
      'PRODUCTS.LIVE_GOLD_PRICE': 'سعر الذهب المباشر',
      'PRODUCTS.CALCULATED_PRICE': 'السعر المحسوب',
      'PRODUCTS.NOT_SPECIFIED': 'غير محدد',
      'PRODUCTS.EMPTY': 'لا توجد منتجات حالياً',


      // Reports
'REPORTS.TITLE': 'التقارير',
'REPORTS.DESCRIPTION': 'نظرة عامة على التقارير المالية والامتثال',

'REPORTS.FINANCE.TITLE': 'المالية',
'REPORTS.FINANCE.DESCRIPTION': 'نظرة عامة على المدفوعات والإيرادات',
'REPORTS.FINANCE.PAID_ORDERS': 'الطلبات المدفوعة',
'REPORTS.FINANCE.PAID_ORDERS_DESCRIPTION': 'الطلبات التي تم دفعها بنجاح',
'REPORTS.FINANCE.TOTAL_PAID_AMOUNT': 'إجمالي المبلغ المدفوع',
'REPORTS.FINANCE.TOTAL_PAID_AMOUNT_DESCRIPTION': 'إجمالي المبلغ المستلم',

'REPORTS.COMPLIANCE.TITLE': 'الامتثال',
'REPORTS.COMPLIANCE.DESCRIPTION': 'نظرة عامة على التحقق من العملاء',
'REPORTS.COMPLIANCE.VERIFIED_CUSTOMERS': 'العملاء الذين تم التحقق منهم',
'REPORTS.COMPLIANCE.VERIFIED_DESCRIPTION': 'تم التحقق منهم بنجاح',
'REPORTS.COMPLIANCE.REJECTED_CUSTOMERS': 'العملاء المرفوضون',
'REPORTS.COMPLIANCE.REJECTED_DESCRIPTION': 'تم رفض عملية التحقق',
'REPORTS.COMPLIANCE.MANUAL_REVIEW': 'المراجعة اليدوية',
'REPORTS.COMPLIANCE.MANUAL_REVIEW_DESCRIPTION': 'تتطلب مراجعة يدوية',

'REPORTS.GENERATED': 'تم الإنشاء',


      // Forgot Password
      'FORGOT_PASSWORD.TITLE': 'نسيت كلمة المرور',
      'FORGOT_PASSWORD.DESCRIPTION':
        'أدخل اسم المستخدم لاستلام تعليمات إعادة تعيين كلمة المرور.',
      'FORGOT_PASSWORD.USERNAME_LABEL': 'اسم المستخدم',
      'FORGOT_PASSWORD.USERNAME_PLACEHOLDER': 'أدخل اسم المستخدم',
      'FORGOT_PASSWORD.USERNAME_REQUIRED': 'اسم المستخدم مطلوب',
      'FORGOT_PASSWORD.SUBMIT': 'إرسال تعليمات إعادة التعيين',
      'FORGOT_PASSWORD.SENDING': 'جاري الإرسال...',
      'FORGOT_PASSWORD.SUCCESS_TITLE': 'تم إرسال التعليمات',
      'FORGOT_PASSWORD.SUCCESS_MESSAGE':
        'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى',
      'FORGOT_PASSWORD.SUCCESS_SUFFIX':
        '. يرجى التحقق من حسابك للحصول على مزيد من التعليمات.',
      'FORGOT_PASSWORD.BACK_TO_LOGIN': 'العودة لتسجيل الدخول',


      //Shared Table
      'TABLE.NO_DATA': 'لا توجد بيانات',
      'TABLE.SHOWING': 'عرض',
      'TABLE.TO': 'إلى',
      'TABLE.OF': 'من',
      'TABLE.RESULTS': 'نتيجة',

      'TABLE.ACTIONS': 'الإجراءات',
      'TABLE.SEARCH': 'بحث...',
      'TABLE.SELECT': 'اختر...',
      'TABLE.PREVIOUS': 'السابق',
      'TABLE.NEXT': 'التالي',
      'TABLE.ROWS_PER_PAGE': 'عدد الصفوف',

      'TABLE.MENU': 'المزيد',


      // Machines
      'MACHINES.TITLE': 'الماكينات',
      'MACHINES.ADD': 'إضافة ماكينة',

      'MACHINES.CREATE.TITLE': 'إضافة ماكينة',
      'MACHINES.CREATE.CODE': 'كود الماكينة',
      'MACHINES.CREATE.LOCATION': 'الموقع',
      'MACHINES.CREATE.CODE_PLACEHOLDER': 'مثال: MC-001',
      'MACHINES.CREATE.LOCATION_PLACEHOLDER': 'مثال: المخزن A',
      'MACHINES.CREATE.SAVE': 'حفظ',
      'MACHINES.CREATE.SAVING': 'جارٍ الحفظ...',
      'MACHINES.CREATE.REQUIRED': 'كود الماكينة والموقع مطلوبان.',
      'MACHINES.CREATE.SUCCESS': 'تم إنشاء الماكينة بنجاح.',
      'MACHINES.CREATE.FAILED': 'فشل إنشاء الماكينة، حاول مرة أخرى.',

      'MACHINES.TOGGLE.TITLE': 'تغيير حالة الماكينة',
      'MACHINES.TOGGLE.SUBTITLE': 'تأكيد تحديث حالة الماكينة',
      'MACHINES.TOGGLE.MESSAGE': 'هل أنت متأكد من تغيير حالة الماكينة؟',
      'MACHINES.TOGGLE.DESCRIPTION': 'سيتم تحديث حالة الماكينة مباشرة.',
      'MACHINES.TOGGLE.CONFIRM': 'تأكيد',
      'MACHINES.TOGGLE.UPDATING': 'جارٍ التحديث...',
      'MACHINES.TOGGLE.SUCCESS': 'تم تحديث حالة الماكينة بنجاح.',
      'MACHINES.TOGGLE.FAILED': 'فشل تحديث حالة الماكينة.',

      'MACHINES.COMMAND.TITLE': 'إرسال أمر للماكينة',
      'MACHINES.COMMAND.SUBTITLE': 'اختر الأمر الذي تريد إرساله إلى الماكينة',
      'MACHINES.COMMAND.SELECT': 'اختر الأمر',

      'MACHINES.COMMAND.RESTART': 'إعادة تشغيل الماكينة',
      'MACHINES.COMMAND.FORCE_OFFLINE': 'إجبار الماكينة على عدم الاتصال',
      'MACHINES.COMMAND.REQUEST_DIAGNOSTICS': 'طلب تشخيص الماكينة',
      'MACHINES.COMMAND.DISPENSE_TEST': 'اختبار صرف المنتج',

      'MACHINES.COMMAND.WARNING':
        'سيتم إرسال هذا الأمر مباشرة إلى الماكينة المحددة.',

      'MACHINES.COMMAND.SENDING': 'جارٍ الإرسال...',
      'MACHINES.COMMAND.SEND': 'إرسال الأمر',

      'MACHINES.COMMAND.SUCCESS':
        'تم إرسال الأمر بنجاح.',

      'MACHINES.COMMAND.FAILED':
        'فشل إرسال الأمر، حاول مرة أخرى.',


      'MACHINES.ID': 'المعرّف',
      'MACHINES.STATUS': 'الحالة',

      'COMMON.CANCEL': 'إلغاء',
      'COMMON.SAVE': 'حفظ',
      'COMMON.CONFIRM': 'تأكيد',
      'COMMON.SUCCESS': 'نجاح',
      'COMMON.ERROR': 'خطأ',
      'COMMON.REFRESH': 'تحديث',

      // Sidebar
      'SIDEBAR.PRODUCTS': 'المنتجات',
      'SIDEBAR.MACHINES': 'الماكينات',
      'SIDEBAR.LOGOUT': 'تسجيل الخروج',
      'SIDEBAR.COLLAPSE': 'تصغير',
      'SIDEBAR.REPORTS':'تقارير',


      //dashboard
      'DASHBOARD': "لوحة التحكم ",


      // Login
      'LOGIN.SIGN_IN':
        'تسجيل الدخول',

      'LOGIN.WELCOME':
        'مرحباً بك مجدداً',

      'LOGIN.WELCOME_MESSAGE':
        'الرجاء تسجيل الدخول للوصول إلى حسابك',

      'LOGIN.EMAIL':
        'البريد الإلكتروني',

      'LOGIN.EMAIL_PLACEHOLDER':
        'name@example.com',

      'LOGIN.PASSWORD':
        'كلمة المرور',

      'LOGIN.PASSWORD_PLACEHOLDER':
        '••••••••',

      'LOGIN.FORGOT_PASSWORD':
        'نسيت كلمة المرور؟',

      'LOGIN.SIGNING_IN':
        'جاري تسجيل الدخول...',

      'LOGIN.LOGIN_BUTTON':
        'تسجيل الدخول',

      'LOGIN.EMAIL_REQUIRED':
        'البريد الإلكتروني مطلوب',

      'LOGIN.EMAIL_INVALID':
        'البريد الإلكتروني غير صحيح',

      'LOGIN.PASSWORD_REQUIRED':
        'كلمة المرور مطلوبة',

      'LOGIN.PASSWORD_MIN_LENGTH':
        'كلمة المرور يجب أن تكون 6 أحرف على الأقل',

      // Machines Table Columns
      'ID': 'المعرّف',
      'LOCATION': 'الموقع',
      'REGISTERED_AT': 'تاريخ التسجيل',
      'STATUS': 'الحالة',

      // Language
      'LANGUAGE.CHANGE':
        'تغيير اللغة',

      // Messages
      'MESSAGES.SUCCESS':
        'نجاح',

      'MESSAGES.LOGIN_SUCCESS':
        '\u0645\u0631\u062d\u0628\u064b\u0627 \u0628\u0639\u0648\u062f\u062a\u0643',

      'MESSAGES.ERROR':
        'خطأ',

      // Footer
      'FOOTER.COPYRIGHT':
        '© 2026 Gold Era. جميع الحقوق محفوظة.'
    }
  };

  t = (key: string) => computed(() => this.dict[this.lang()]?.[key] ?? key);

  translate(key: string): string {
    return this.dict[this.lang()]?.[key] ?? key;
  }

  constructor() {
    effect(() => {
      const d = this.dir();
      const l = this.lang();
      document.documentElement.setAttribute('dir', d);
      document.documentElement.setAttribute('lang', l);
      document.body.classList.toggle('rtl', d === 'rtl');
      localStorage.setItem(this.STORAGE_DIR, d);
      localStorage.setItem(this.STORAGE_LANG, l);
    });
  }

  setLang(lang: Lang) {
    this.lang.set(lang);
    this.dir.set(lang === 'ar' ? 'rtl' : 'ltr');
  }

  setDir(dir: Dir) {
    this.dir.set(dir);
  }

  toggleLang() {
    this.setLang(this.lang() === 'en' ? 'ar' : 'en');
  }

  toggleDir() {
    this.dir.set(this.dir() === 'ltr' ? 'rtl' : 'ltr');
  }
}
