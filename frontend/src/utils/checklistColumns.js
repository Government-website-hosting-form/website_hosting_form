

export const securityColumns = [
  "captcha_lockout_login",
  "input_validation_client_server",
  "parameterized_queries_sql_injection",
  "audit_action_trails",
  "pre_post_auth_session_cookies",
  "access_control_list_acl",
  "no_direct_thirdparty_reference",
  "trusted_thirdparty_components",
  "encrypted_critical_data",
  "restrict_public_critical_info",
  "password_hashing_sha",
  "change_forgot_password_module",
  "password_policy_compliance",
  "post_method_usage",
  "proper_error_handling",
  "csrf_token_protection",
  "no_file_upload_public",
  "files_stored_in_database",
  "unique_unpredictable_ids",
  "session_timeout",
  "admin_url_restricted_ip",
];

export const otherColumns = [
  "thirdparty_links_new_tab",
  "disable_trace_put_delete",
  "email_image_format",
  "disable_directory_listing",
  "autocomplete_off_forms",
  "prevent_page_caching",
  "logout_button_all_pages",
];

export const implementationColumns = [
  "restricted_min_access",
  "latest_nonvulnerable_versions",
  "audit_trail_system_logs",
  "regular_backups",
];
