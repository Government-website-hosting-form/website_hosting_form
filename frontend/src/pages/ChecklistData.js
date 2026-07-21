export const securityChecklist = [
  "Implement CAPTCHA on all entry forms in PUBLIC pages. Implement CAPTCHA or account-lockout feature on the login form. [Alpha-numeric CAPTCHA with minimum 6 characters]",

  "Implement proper validations on all input parameters in client and serverside (both). [White-listing of charactersis preferred over Black-listing]",

  "Use parameterized queries or Stored-procedures to query output from databases, instead of inline SQL queries [Prevention of SQL Injection]",

  "Implement proper Audit/Action Trails in applications",

  "Use different Pre and Post authentication session values/Authentication-cookies",

  "Implement proper Access matrix (Access Control List-ACL)to prevent un-authorized access to resources/pages/forms in website [Prevention of Privilege escalation and restrict in of accessto authorized/authenticated content ]",

  "Do not reference components(such as javascripts,stylesheets etc.) directly third-party sites. [They may be downloaded and self-referenced in website]",

  "Use third-Party components from trusted source only. [Components with known vulnerabilities are not recommended.]",

  "Store critical data such as PAN number,MobileNumber,Aadhar Card number etc. in encrypted form in the database. [Hashing of sensitive information is preferred over encryption, unless required to be decrypted]",

  "Prevent critical information from public access by any mean [Critical information like credit card number, account number, aadhar number etc. should be restricted to authorized persons only. If such information is stored in static files such as excel,pdf etc., sufficient measures should be taken so that it is not accessible to unauthorized persons or in public.]",

  "Hash the password before it is relayed over network, or is stored in database. [During login, password should be salt-hashed using SHA-256/512. However, it should be stored as plain hash (SHA-256/512) in database.On every login attempt, new salt should be used, and it should be generated from server-side only]",

  "Implement Change Password and Forgot password module in applications [not required in applications, using LDAP for authentication]",

  "Comply with Password Policy, wherever passwords are being used.",

  "Use Post methods to pass parameters as values from one page/website to another. [GET methods should be avoided]",

  "Implement proper error-handling. [System/application errors should not be displayed to viewer]",

  "Implementtoken-based system that changes on every web request in application,to prevent CSRF. [CSRF Guard or Anti-forgery tokens can be implemented in non critical applications. Websites using payment-gateways etc. are categorized in critical websites.]",

  "Do not implement File upload in public modules",

  "Store uploaded files in database,rather than storing them in file system [Files stored in database cannot be executed directly, hence this is more secure than storing them in file system.]",

  "Generate unique, un-predictable and non-sequential receipt numbers/acknowledgement numbers/application numbers/roll numbers/File-names etc. It is preferable that strong algorithm be used to generate such numbers.",

  "Implement proper Session Timeout [Logged-In user should be logged-out after a specific period(say 20 minutes) of inactivity]",

  "Assure admin/Super-Admin URL's is/are accessible from restricted IP's only [For this, segregate public URL from Admin/Super-Admin module. Public modules and Admin/Super-Admin modules should be deployed on separate URL's. Admin/Super-Admin URL's should be accessible from restricted IP's only. It is preferable to allow access for Admin/Super-Admin modules through VPN]"
];



export const otherActionItems = [
  "Assure third-Party links/page(partial/full) open in different tab, with a disclaimer.",

  "Disable Trace/PUT/DELETE and other non-required methods in application/web-server.",

  "Assure that Email addresses, where ever used, are in form of an image. [Alternatively, replace '@' with [at] and '.' with [dot] in email addresses]",

  "Disable directory listing",

  "Set 'Auto Complete' off for textboxes in forms",

  "Prevent pages from being stored in history/cache. [Each time that the user tries to fetch a page, it should request server to serve with a fresh copy of the page]",

  "Implement Logout buttons in all authenticated pages"
];



export const implementationGuidelines = [
  "Restrict each application for minimum access(only required access) [Allow access of application for restricted network access. Websites, those are to be used in local-network, should not be accessible from any other network. For exceptional cases, VPN may be used. Websites,those are required to be accessed from within the country,should be restricted for access on Indian ISP's ONLY.]",

  "Use the latest and non-vulnerable versions of Application Server (IIS/Apache etc.), query etc.",

  "Enable audit-trails and system logs on server [e.g.: Web-Accesslogs, Application Logs, Security Logs etc.]",

  "Take regular backups of data and application [Sufficient arrangements should be made to take proper and regular backups of database,application and other related objects/components, for retrieval on undesirable circumstances. It is preferable to maintain a set of last 5 backups. It is advised to store backups on hard-drive/tape-disks/SAN storage. Networked servers/machines should be avoided for this activity]"
];