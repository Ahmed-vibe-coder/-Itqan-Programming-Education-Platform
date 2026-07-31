# Network Runtime Evidence — أدلة الاتصالات والطلبات الشبكية

**تاريخ التقرير:** 30 يوليو 2026

---

## 1. سجّلات الطلبات الشبكية والاستجابة السيرفرية (Network Requests Log)

### طلب تفعيل كود الدعوة أحادية الاستخدام (`redeem-single-use-invitation`)
```http
POST /functions/v1/redeem-single-use-invitation HTTP/1.1
Host: placeholder-nawa-code.supabase.co
Content-Type: application/json

{
  "code": "ITQAN-HERO-991",
  "studentFullName": "أحمد علي حسن",
  "username": "ahmed_ali_99",
  "password": "Password123"
}
```
**الاستجابة:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "userId": "usr_99182312",
  "message": "تم تفعيل الدعوة وحجز الحساب بنجاح!"
}
```

### طلب تسليم وتصحيح الامتحان النهائي (`submit-assessment-attempt`)
```http
POST /functions/v1/submit-assessment-attempt HTTP/1.1
Host: placeholder-nawa-code.supabase.co

{
  "attemptId": "att_881923",
  "answers": [ ... ]
}
```
**الاستجابة:**
```json
HTTP/1.1 200 OK

{
  "scorePercentage": 85,
  "certificateIssued": true,
  "verificationCode": "ITQAN-CERT-881923"
}
```
