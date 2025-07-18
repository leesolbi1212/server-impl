# 게시판 웹 애플리케이션 (Spring Boot + React)

Spring Boot, React, MyBatis, MySQL을 활용하여 제작된 회원 관리 및 게시판 기능을 제공하는 웹 애플리케이션입니다.

## 프로젝트 개요 

사용자는 회원가입 후 로그인하여 게시글을 작성하고 관리할 수 있습니다. 로그인 인증은 JWT를 사용하며, React 프론트엔드를 통해 간편하고 직관적인 UI를 제공합니다.

## 주요 기능 

* **회원 관리**: 회원가입, 로그인/로그아웃 (JWT 인증)
* **게시판 관리**: 게시글 작성, 조회, 수정, 삭제

## 사용 기술 

* **백엔드**: Java 17, Spring Boot 3.x, MyBatis, Spring Security (JWT 인증)
* **데이터베이스**: MySQL 8.0
* **프론트엔드**: React 18, Axios, React Router DOM, Vite
* **빌드 도구**: Gradle (백엔드), Vite (프론트엔드)

## 설치 및 실행 방법 

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd study-management-system
```

### 2. 데이터베이스 설정 

* MySQL에서 test 데이터베이스 활용 및 'database.sql' 파일을 구현하여 테이블 생성 및 초기 데이터 입력

### 3. 애플리케이션 설정 (`application.properties`)

```properties
spring.application.name=server-impl

spring.datasource.url=jdbc:mysql://localhost:3306/test?serverTimezone=Asia/Seoul
spring.datasource.username=사용자명
spring.datasource.password=비밀번호

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.test.serverimpl.domain
```

### 4. 빌드 및 실행

* 백엔드
  
```bash
  cd server-impl
./gradlew build
./gradlew bootRun
```

* 프론트 엔드

```bash
npm install
npm run dev
```

## API 엔드포인트

### 공개 (모두 접근 가능)

* 회원가입 : [POST] /api/member/register
* 로그인 : [POST] /api/member/login
* 게시글 조회 : [GET] /api/posts

### 보호 (로그인 필요)
* 게시글 작성 : [POST] /api/posts
* 게시글 수정 : [PUT] /api/posts/{id}
* 게시글 삭제 : [DELETE] /api/posts/{id}

## 데이터베이스 스키마 

### 사용자 테이블 ('users')

* user_id (PK)
* username (고유값)
* password (BCrypt 암호화)
* email (고유값)
* nickname
* created_at
* updated_at

### 게시글 테이블 (posts)

* post_id (PK)
* user_id (users 외래키)
* title
* content
* created_at
* updated_at

## 보안 기능 

* JWT 기반 로그인 인증
* 비밀번호 BCrypt 암호화
* Spring Security를 통한 접근 제어

## 사용법

1. 회원가입 및 로그인
2. 게시글 조회 및 작성
3. 게시글 수정 및 삭제







