import nodemailer from 'nodemailer';

// 이메일 전송을 위한 transporter 설정
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 사용자에게 보내는 감사 이메일 템플릿
const createUserEmailTemplate = (name) => `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>KT지니원 상담 신청 완료</title>
</head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:'Apple SD Gothic Neo',Roboto,'Malgun Gothic',sans-serif;">
    <!-- 전체 래퍼 -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;">
            <tr>
                <td style="padding:40px 12px;">
                <!-- 실제 카드 -->
                <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
                <!-- 헤더 -->
            <tr>
                <td  style="background:#ff3b30;color:#ffffff;font-size:24px;font-weight:700;padding:32px 24px;">
                KT&nbsp;지니원
                </td>
            </tr>

            <!-- 본문 -->
            <tr>
                <td style="padding:40px 32px 32px 32px;color:#333333;font-size:16px;line-height:1.7;">
                안녕하세요, <strong>${name}님</strong>!<br><br>
                <span style="color:#ff3b30;font-weight:600;">KT지니원&nbsp;올인원&nbsp;패키지</span> 상담 신청이 정상적으로 접수되었습니다.<br>
                입력해주신 상담 가능 시간에 담당 컨설턴트가 연락드릴 예정입니다.<br><br>
                궁금한 사항이 있으시면 언제든지 회신해 주세요.
                </td>
            </tr>

            <!-- CTA 버튼 -->
            <tr>
                <td  style="padding:0 32px 40px 32px;text-align:center;">
                <a href="https://kt-telecop.co.kr/bbs/board.php?bo_table=allinone&wr_id=1" target="_blank"
                    style="display:inline-block;padding:14px 28px;background:#ff3b30;color:#ffffff;
                            text-decoration:none;border-radius:4px;font-weight:600;font-size:16px;">
                    홈페이지 둘러보기
                </a>
                <a href="https://www.notion.so/KT-1f5dffd0949b8071a2abeeee34f65433?pvs=4" target="_blank" 
                    style="display:inline-block;padding:14px 28px;background:#ff3b30;color:#ffffff;
                            text-decoration:none;border-radius:4px;font-weight:600;font-size:16px;">
                    필수안내서 보기 
                </a>
                </td>
            </tr>

            <!-- 푸터 -->
            <tr>
                <td style="border-top:1px solid #e0e0e0;padding:24px 32px;text-align:center;
                        color:#8e8e93;font-size:13px;line-height:1.5;">
                감사합니다.<br>
                <strong>KT지니원 드림</strong><br><br>
                본 메일은 발신 전용입니다.<br>
                문의: <a href="kt.genieone@gmail.com" style="color:#8e8e93;text-decoration:underline;">
                kt.genieone@gmail.com</a>
                </td>
            </tr>
            </table>
        </td>
        </tr>
    </table>
</body>
</html>
`;

// 회사로 보내는 알림 이메일 템플릿
const createCompanyEmailTemplate = (formData) => `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>새 상담 신청 알림</title>
</head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:'Apple SD Gothic Neo',Roboto,'Malgun Gothic',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;">
    <tr>
        <td align="left" style="padding:40px 12px;">
            <!-- 카드 -->
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
                <!-- 헤더 -->
                <tr>
                    <td style="background:#0070f3;color:#ffffff;font-size:22px;font-weight:700;padding:28px 24px;text-align:center;">
                    새로운 상담 신청이 접수되었습니다
                    </td>
                </tr>

                <!-- 안내 텍스트 -->
                <tr>
                    <td style="padding:28px 32px 16px 32px;color:#333333;font-size:15px;line-height:1.6;">
                    아래 신청자 정보를 확인 후&nbsp;<strong>2시간 이내</strong>에 연락해 주세요.
                    </td>
                </tr>

                <!-- 상세 테이블 -->
                <tr>
                    <td style="padding:0 32px 32px 32px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:15px;color:#333;">
                            ${
                                [
                                    ['성함/상호', formData.name],
                                    ['연락처', formData.phone],
                                    ['지역', formData.region],
                                    ['업종', formData.business],
                                    ['매장평수', formData.size],
                                    [
                                    '필요한 상품',
                                    (
                                        (formData.products || [])                 // 배열 그대로
                                        .concat(formData.productEtc || [])      // 기타 입력 이어 붙임
                                    ).join('<br>')                                // → “인터넷, TV, CCTV” 형식
                                    ],
                                    ['상담 가능 시간', formData.consultTime],
                                    ['이메일', formData.email],
                                    ['상품 안내서 필독', formData.needGuide ? '예' : '아니요']
                                ]
                                    .map(
                                    ([label, value]) => `
                                    <tr>
                                        <td width="35%" style="background:#f1f1f1;padding:10px 12px;font-weight:600;">
                                        ${label}
                                        </td>
                                        <td width="65%" style="padding:10px 12px;">${value || '-'}</td>
                                    </tr>`
                                    )
                                .join('')
                            }
                        </table>
                    </td>
                </tr>

            <!-- 푸터 -->
            <tr>
                <td style="border-top:1px solid #e0e0e0;padding:20px 32px;text-align:center;font-size:12px;color:#8e8e93;line-height:1.5;">
                본 메일은 KT지니원 내부 알림 용도로 자동 발송되었습니다.
                </td>
            </tr>
            </table>
        </td>
        </tr>
    </table>
</body>
</html>
`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, answers } = req.body;

        // 사용자에게 감사 이메일 전송
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'KT지니원 올인원 패키지 상담 신청 완료',
            html: createUserEmailTemplate(answers.name)
        });

        // 회사로 알림 이메일 전송
        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.COMPANY_EMAIL,
        subject: '새로운 상담 신청 접수',
        html: createCompanyEmailTemplate(answers)
        });

        res.status(200).json({ message: '이메일이 성공적으로 전송되었습니다.' });
    } catch (error) {
        console.error('이메일 전송 중 오류 발생:', error);
        res.status(500).json({ message: '이메일 전송 중 오류가 발생했습니다.' });
    }
} 