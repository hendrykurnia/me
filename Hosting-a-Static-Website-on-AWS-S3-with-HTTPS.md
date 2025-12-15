# How to Host a Static Website on AWS S3 and Publish It Securely over HTTPS

This document describes how **hendrykurnia.com** is hosted as a secure (HTTPS) static website using **AWS S3, CloudFront, ACM, and Route 53**, with the domain registered at **Namecheap**.

---

## Architecture Overview

- **Amazon S3**: Hosts static website files (private buckets)
- **Amazon CloudFront**: CDN and HTTPS termination
- **AWS Certificate Manager (ACM)**: SSL/TLS certificates
- **Amazon Route 53**: DNS management
- **Namecheap**: Domain registrar

---

## 1. Register the Domain

- Domain registered at **Namecheap**
  - `hendrykurnia.com`

---

## 2. Register an AWS Account

- Create or use an existing AWS account
- Required AWS services:
  - Amazon S3
  - Amazon CloudFront
  - AWS Certificate Manager (ACM)
  - Amazon Route 53

---

## 3. Create S3 Buckets

### 3.1 Primary Content Bucket

**Bucket name:** `hendrykurnia.com`

**Properties**
- Static website hosting: **Enabled**
- Hosting type: **Static website**
- Index document: `index.html`

**Permissions**
- Block public access: **On**
- Access granted via **CloudFront Origin Access Control (OAC)**
- Bucket policy: *Added after CloudFront distribution is created*

---

### 3.2 Redirect Buckets

**Buckets**
- `www.hendrykurnia.com`
- `about.hendrykurnia.com`
- `me.hendrykurnia.com`

**Properties**
- Static website hosting: **Enabled**
- Hosting type: **Redirect requests**
- Target host name: `hendrykurnia.com`
- Protocol: **None** (CloudFront will enforce HTTPS)

**Permissions**
- Block public access: **On**
- Bucket policy: **None**

---

## 4. Set Up SSL Certificate (ACM)

> ⚠️ Certificates used by CloudFront must be created in **us-east-1**

1. Go to **AWS Certificate Manager (ACM)**
2. Select **Request a public certificate**
3. Enter domain names:
   - `hendrykurnia.com`
   - `www.hendrykurnia.com`
   - `about.hendrykurnia.com`
   - `me.hendrykurnia.com`
4. Validation method: **DNS validation**
5. Add the generated DNS validation records to DNS (Route 53 or Namecheap)

---

## 5. Create CloudFront Distribution

**General**
- Distribution name: Any
- Distribution type: **Single website or app**

**Origin**
- Origin type: **Amazon S3**
- Origin: `hendrykurnia.com`
- Access: **Origin Access Control (OAC)**

**Security**
- Security protections: **Do not enable** (to avoid additional cost)

**Settings**
- Alternate domain names (CNAMEs):
  - `hendrykurnia.com`
  - `www.hendrykurnia.com`
  - `about.hendrykurnia.com`
  - `me.hendrykurnia.com`
- Custom SSL certificate: Select the ACM certificate
- Default root object: `index.html`

**Post-creation**
- Attach the generated **OAC bucket policy** to the `hendrykurnia.com` S3 bucket

---

## 6. Set Up Route 53

### 6.1 Create Hosted Zone

- Domain name: `hendrykurnia.com`
- Type: **Public hosted zone**

---

### 6.2 Create DNS Records

Create **A records** with **Alias = On**:

| Record Name | Route Traffic To | Target CloudFront Distribution |
|------------|-----------------|--------------------------------|
| (root)     | CloudFront      | hendrykurnia.com               |
| www        | CloudFront      | www.hendrykurnia.com           |
| me         | CloudFront      | me.hendrykurnia.com            |
| about      | CloudFront      | about.hendrykurnia.com         |

---

## 7. Update Namecheap Nameservers

1. In Route 53, copy the **NS record values** from the hosted zone
2. Go to **Namecheap → Domain List → Advanced DNS**
3. Replace the existing nameservers with the Route 53 nameservers

---

## Final Result

- Static content hosted privately in S3
- Public access served through CloudFront only
- HTTPS enforced via ACM
- All subdomains securely routed through CloudFront

---

## Notes & Best Practices

- Keep S3 buckets **private** when using CloudFront
- Use **OAC** instead of legacy OAI
- DNS and certificate validation may take **minutes to hours**
- CloudFront distribution changes may take **10–30 minutes** to deploy

---

✅ Website successfully published over HTTPS using AWS
