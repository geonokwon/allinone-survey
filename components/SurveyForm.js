import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const PRODUCT_OPTIONS = [
  '인터넷, 와이파이',
  'TV',
  '전화(인터넷전화, 일반전화, AI전화)',
  'CCTV',
  '출동방범',
  '포스기',
  '테이블오더(하이오더)',
  '서빙로봇',
  '정수기',
  // 기타 옵션은 입력란으로 따로 처리
];

const TIME_OPTIONS = [
  '오전 10~12시',
  '오후 15~18시',
];

const initialTouched = {
  name: false,
  phone: false,
  region: false,
  business: false,
  size: false,
  email: false,
  consultTime: false,
  needGuide: false,
  products: false,
};

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
    business: '',
    size: '',
    products: [],
    productEtc: '',
    consultTime: '',
    email: '',
    needGuide: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [touched, setTouched] = useState(initialTouched);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add refs for each required field
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const regionRef = useRef(null);
  const businessRef = useRef(null);
  const sizeRef = useRef(null);
  const consultTimeRef = useRef(null);
  const emailRef = useRef(null);
  const needGuideRef = useRef(null);
  const productsRef = useRef(null);

  // 모든 텍스트 입력란 필수
  const errors = {
    name: !formData.name,
    phone: !formData.phone,
    region: !formData.region,
    business: !formData.business,
    size: !formData.size,
    email: !formData.email,
    consultTime: !formData.consultTime,
    needGuide: !formData.needGuide,
    products: formData.products.length === 0,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/[^0-9]/g, ''); // 숫자만 추출
      let formattedValue = '';
      if (cleaned.length > 0) {
        formattedValue = cleaned.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
        // Handle cases where the regex doesn't match perfectly during typing
        if (cleaned.length <= 3) {
          formattedValue = cleaned;
        } else if (cleaned.length <= 7) {
          formattedValue = `${cleaned.slice(0,3)}-${cleaned.slice(3)}`;
        } else {
          formattedValue = `${cleaned.slice(0,3)}-${cleaned.slice(3,7)}-${cleaned.slice(7,11)}`;
        }
      }
      // Prevent more than 13 characters (e.g., 010-1234-5678)
      if (formattedValue.length > 13) {
        formattedValue = formattedValue.slice(0, 13);
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCheckboxChange = (e, group) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const arr = prev[group];
      return {
        ...prev,
        [group]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      };
    });
    if (group === 'products') {
      setTouched((prev) => ({ ...prev, products: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 모든 필수 입력란 체크
    const newTouched = { ...touched };
    let hasError = false;
    let firstErrorRef = null;

    // Check each field in order
    if (errors.name) {
      newTouched.name = true;
      hasError = true;
      firstErrorRef = nameRef;
    } else if (errors.phone) {
      newTouched.phone = true;
      hasError = true;
      firstErrorRef = phoneRef;
    } else if (errors.region) {
      newTouched.region = true;
      hasError = true;
      firstErrorRef = regionRef;
    } else if (errors.business) {
      newTouched.business = true;
      hasError = true;
      firstErrorRef = businessRef;
    } else if (errors.size) {
      newTouched.size = true;
      hasError = true;
      firstErrorRef = sizeRef;
    } else if (errors.products) {
      newTouched.products = true;
      hasError = true;
      firstErrorRef = productsRef;
    } else if (errors.consultTime) {
      newTouched.consultTime = true;
      hasError = true;
      firstErrorRef = consultTimeRef;
    } else if (errors.email) {
      newTouched.email = true;
      hasError = true;
      firstErrorRef = emailRef;
    } else if (errors.needGuide) {
      newTouched.needGuide = true;
      hasError = true;
      firstErrorRef = needGuideRef;
    }

    setTouched(newTouched);
    
    if (hasError) {
      setStatus({ type: 'error', message: '필수 입력란을 모두 입력해 주세요.' });
      // Scroll to the first error field with offset
      if (firstErrorRef && firstErrorRef.current) {
        const yOffset = -400; // 상단에서 100px 아래로
        const y = firstErrorRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/submit-survey', {
        email: formData.email,
        answers: formData,
      });
      setStatus({
        type: 'success',
        message: '상담 신청이 성공적으로 제출되었습니다. 감사합니다!',
      });
      setFormData({
        name: '',
        phone: '',
        region: '',
        business: '',
        size: '',
        products: [],
        productEtc: '',
        consultTime: '',
        email: '',
        needGuide: '',
      });
      setTouched(initialTouched);
      setOpenSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus({
        type: 'error',
        message: '제출 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    setLoading(false);
  };

  return (
    <>
      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff', backdropFilter: 'blur(2px)' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog open={openSuccess} onClose={() => setOpenSuccess(false)}>
        <DialogTitle sx={{ fontFamily: 'Pretendard-Bold', fontSize: 18 }}>성공했습니다!</DialogTitle>
        <DialogContent sx={{ fontFamily: 'Pretendard-Medium', fontSize: 18 }}>
          상담 신청이 성공적으로 제출되었습니다. 감사합니다!
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccess(false)} color="primary" autoFocus sx={{ fontFamily: 'Pretendard-Bold', fontSize: 18 }}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
        <CardContent>
          {/* 상단 이미지 자리 */}
          <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: 'grey.300', borderWidth: 0 }}>
            <img
              src="/top_benner.gif"
              alt="상단 이미지"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '196px',
                objectFit: 'cover',
                borderRadius: 8
              }}
            />
          </Card>
          <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 0, borderColor: 'grey.300', borderWidth: 1, p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Pretendard-Bold' }} component="div">
              KT지니원 올인원 패키지 상담신청
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} component="div">
              한 번의 상담으로 매장운영에 필요한 기본 서비스를 구축!<br />
              시간과 비용 절약, 맞춤형 서비스까지!<br />
              <br />
              <b>※ KT지니원 고객님의 시간을 소중히 생각합니다.</b><br />
              - 올인원 패키지는 고객님의 시간을 아껴드리기 위해 예약상담만 가능합니다.<br />
              - 고객님 상담시간을 맞춰드리기 위해 상담 가능시간을 꼭 입력해 주세요.<br />
              <br />
              <b>편리함</b> : 한 번의 상담으로 모든 상품의 궁금증 해결<br />
              <b>합리적인 가격 혜택</b> : 개별가입보다 더 많은 결합 혜택을 누리세요!<br />
              <b>일정관리 및 신속 A/S</b> : 바쁜 사장님을 걱정없이 전국 어디서든 신속한 A/S!
            </Typography>
            <Divider sx={{ }} />
            {status.message && (
              <Alert severity={status.type} sx={{ my: 1 }}>
                {status.message}
              </Alert>
            )}
          </Card>
          <Box component="form" onSubmit={handleSubmit}>
            
            <Grid container spacing={2}>
              {/* 성함 / 상호 적는 인풋 라벨 (텍스트라고 생각하면 됨) */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: errors.name && touched.name ? 'error.main' : 'grey.300', borderWidth: 1, p: 2 }}>
                  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    
                    <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: 'Pretendard-Bold' }} component="div">
                      성함 / 상호 (예시: 홍길동 / 지니원) <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                      <TextField
                        ref={nameRef}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.name && touched.name ? (
                            <Typography component="span" sx={{ color: 'error.main', fontFamily: 'Pretendard-Medium', fontSize: 14 }}>
                              필수 질문입니다.
                            </Typography>
                          ) : ' '
                        }
                        size="small"
                        variant="outlined"
                        InputProps={{
                          sx: {
                            fontSize: 16,
                            borderRadius: 1.5,
                            background: '#fff',
                            height: 44,
                            boxSizing: 'border-box',
                            borderColor: errors.name && touched.name ? 'error.main' : 'grey.300',
                          },
                        }}
                        FormHelperTextProps={{ 
                          component: 'div',
                          sx: { margin: 0, minHeight: 0, padding: 0, pl: 0.5 } 
                        }}
                        sx={{ width: { xs: '90%', sm: '40%' }, minWidth: 140, maxWidth: 250, ml: 0, mb: 0 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* 연락처 적는 인풋 라벨 (텍스트라고 생각하면 됨) */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: errors.phone && touched.phone ? 'error.main' : 'grey.300', borderWidth: 1 }}>
                  <CardContent>
                    
                    <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: 'Pretendard-Bold' }} component="div">
                      연락처 (예시: 010-0000-0000) <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                      <TextField
                        ref={phoneRef}
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.phone && touched.phone ? (
                            <Typography component="span" sx={{ color: 'error.main', fontFamily: 'Pretendard-Medium', fontSize: 14 }}>
                              필수 질문입니다.
                            </Typography>
                          ) : ' '
                        }
                        size="small"
                        InputProps={{
                          sx: {
                            fontSize: 16,
                          },
                        }}
                        FormHelperTextProps={{ 
                          component: 'div',
                          sx: { margin: 0, minHeight: 0, padding: 0 } 
                        }}
                        sx={{ width: { xs: '90%', sm: '40%' }, minWidth: 140, maxWidth: 250, ml: 0, mb: 0 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* 지역 적는 인풋 라벨 (텍스트라고 생각하면 됨) */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: errors.region && touched.region ? 'error.main' : 'grey.300', borderWidth: 1 }}>
                  <CardContent>
                    
                    <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: 'Pretendard-Bold' }} component="div">
                      지역 (예시: 서울 / OO동) <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                      <TextField
                        ref={regionRef}
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.region && touched.region ? (
                            <Typography component="span" sx={{ color: 'error.main', fontFamily: 'Pretendard-Medium', fontSize: 14 }}>
                              필수 질문입니다.
                            </Typography>
                          ) : ' '
                        }
                        size="small"
                        InputProps={{
                          sx: {
                            fontSize: 16,
                          },
                        }}
                        FormHelperTextProps={{ 
                          component: 'div',
                          sx: { margin: 0, minHeight: 0, padding: 0 } 
                        }}
                        sx={{ width: { xs: '90%', sm: '40%' }, minWidth: 140, maxWidth: 250, ml: 0, mb: 0 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* 업종 적는 인풋 라벨 (텍스트라고 생각하면 됨) */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: errors.business && touched.business ? 'error.main' : 'grey.300', borderWidth: 1 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: 'Pretendard-Bold' }} component="div">
                      업종 (예시: 요식업, 미용실, 요가센터, 사무실) <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                      <TextField
                        ref={businessRef}
                        name="business"
                        value={formData.business}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.business && touched.business ? (
                            <Typography component="span" sx={{ color: 'error.main', fontFamily: 'Pretendard-Medium', fontSize: 14 }}>
                              필수 질문입니다.
                            </Typography>
                          ) : ' '
                        }
                        size="small"
                        InputProps={{
                          sx: {
                            fontSize: 16,
                          },
                        }}
                        FormHelperTextProps={{ 
                          component: 'div',
                          sx: { margin: 0, minHeight: 0, padding: 0 } 
                        }}
                        sx={{ width: { xs: '90%', sm: '40%' }, minWidth: 140, maxWidth: 250, ml: 0, mb: 0 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* 매장평수 적는 인풋 라벨 (텍스트라고 생각하면 됨) */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: errors.size && touched.size ? 'error.main' : 'grey.300', borderWidth: 1 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: 'Pretendard-Bold' }} component="div">
                      매장평수 (예시: 40평) <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                      <TextField
                        ref={sizeRef}
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.size && touched.size ? (
                            <Typography component="span" sx={{ color: 'error.main', fontFamily: 'Pretendard-Medium', fontSize: 14 }}>
                              필수 질문입니다.
                            </Typography>
                          ) : ' '
                        }
                        size="small"
                        InputProps={{
                          sx: {
                            fontSize: 16,
                          },
                        }}
                        FormHelperTextProps={{ 
                          component: 'div',
                          sx: { margin: 0, minHeight: 0, padding: 0 } 
                        }}
                        sx={{ width: { xs: '90%', sm: '40%' }, minWidth: 140, maxWidth: 250, ml: 0, mb: 0 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* 필요한 상품 적는 인풋 라벨 (텍스트라고 생각하면 됨) */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: errors.products && touched.products ? 'error.main' : 'grey.300', borderWidth: 1 }}>
                  <CardContent ref={productsRef}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: 'Pretendard-Bold' }} component="div">
                      필요한 상품 (중복선택 가능) <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <FormGroup sx={{ mt: 2 }}>
                      {PRODUCT_OPTIONS.map((option) => (
                        <FormControlLabel
                          key={option}
                          control={
                            <Checkbox
                              checked={formData.products.includes(option)}
                              onChange={(e) => handleCheckboxChange(e, 'products')}
                              value={option}
                            />
                          }
                          label={option}
                        />
                      ))}
                      <TextField
                        label="기타(직접입력)"
                        name="productEtc"
                        value={formData.productEtc}
                        onChange={handleChange}
                        size="small"
                        InputProps={{
                          sx: {
                            fontSize: 16,
                          },
                        }}
                        FormHelperTextProps={{ sx: { margin: 0, minHeight: 0, padding: 0 } }}
                        sx={{ minWidth: 140, maxWidth: 180, width: { xs: '90%', sm: '30%' }, mb: 0, mt: 1 }}
                      />
                    </FormGroup>
                    {errors.products && touched.products && (
                      <Typography component="div" sx={{ color: 'error.main', fontFamily: 'Pretendard-Medium', fontSize: 14, mt: 1 }}>
                        최소 1개 이상 선택해 주세요.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              {/* 상담 가능 시간 적는 인풋 라벨 (텍스트라고 생각하면 됨) */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: errors.consultTime && touched.consultTime ? 'error.main' : 'grey.300', borderWidth: 1 }}>
                  <CardContent ref={consultTimeRef}>      
                    <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: 'Pretendard-Bold' }} component="div">
                      상담 가능 시간 <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2, ml: 1 }}>
                      <RadioGroup
                        name="consultTime"
                        value={formData.consultTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <FormControlLabel 
                          value="오전 10~12시" 
                          control={
                            <Radio
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                            />
                          } 
                          label="오전 10~12시" 
                        />
                        <FormControlLabel 
                          value="오후 15~18시" 
                          control={
                            <Radio
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                            />
                          } 
                          label="오후 15~18시" 
                        />
                      </RadioGroup>
                    </Box>
                    {errors.consultTime && touched.consultTime && (
                      <Typography component="div" sx={{ color: 'error.main', fontFamily: 'Pretendard-Medium', fontSize: 14 }}>
                        상담 가능 시간을 선택해 주세요.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              {/* 이메일 적는 인풋 라벨 (텍스트라고 생각하면 됨) */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: errors.email && touched.email ? 'error.main' : 'grey.300', borderWidth: 1 }}>
                  <CardContent>  
                    <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: 'Pretendard-Bold' }} component="div">
                      이메일 오타조심! (상담 필수 안내서가 이메일로 전송) <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                      <TextField
                        ref={emailRef}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.email && touched.email ? (
                            <Typography component="span" sx={{ color: 'error.main', fontFamily: 'Pretendard-Medium', fontSize: 14 }}>
                              필수 질문입니다.
                            </Typography>
                          ) : ' '
                        }
                        size="small"
                        variant="outlined"
                        InputProps={{
                          sx: {
                            fontSize: 16,
                          },
                        }}
                        FormHelperTextProps={{ 
                          component: 'div',
                          sx: { margin: 0, minHeight: 0, padding: 0 } 
                        }}
                        sx={{ width: { xs: '90%', sm: '40%' }, minWidth: 140, maxWidth: 250, ml: 0, mb: 0 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* 상품 필수 안내서 필독 하실거죠? 적는 인풋 라벨 (텍스트라고 생각하면 됨) */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: errors.needGuide && touched.needGuide ? 'error.main' : 'grey.300', borderWidth: 1 }}>
                  <CardContent ref={needGuideRef}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: 'Pretendard-Bold' }} component="div">
                      상품 필수 안내서 필독 하실거죠? <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2, ml: 1 }}>
                      <RadioGroup
                        name="needGuide"
                        value={formData.needGuide}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        row={false}
                      >
                        <FormControlLabel
                          value="YES"
                          control={
                            <Radio
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                            />
                          }
                          label="YES"
                        />
                        <FormControlLabel
                          value="NO"
                          control={
                            <Radio
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                            />
                          }
                          label="NO"
                        />
                      </RadioGroup>
                    </Box>
                    {errors.needGuide && touched.needGuide && (
                      <Typography component="div" sx={{ color: 'error.main', fontFamily: 'Pretendard-Medium', fontSize: 14 }}>
                        필수 항목입니다.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                >
                  상담 신청하기
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default SurveyForm; 