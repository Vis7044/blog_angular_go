package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"github.com/blog_go/config"
)

// BrevoService handles sending emails via Brevo API
type BrevoService struct {
	ApiKey     string
	SenderName string
	SenderEmail string
}

// New creates a new BrevoService instance (loads API key from env)
func NewBrevoService(senderName, senderEmail string) *BrevoService {
	apiKey := config.Cfg.BrevoApiKey
	if apiKey == "" {
		panic("BREVO_API_KEY not set in environment")
	}
	return &BrevoService{
		ApiKey:     apiKey,
		SenderName: senderName,
		SenderEmail: senderEmail,
	}
}

// SendTemplateEmail sends an email using a Brevo template with parameters
func (b *BrevoService) SendTemplateEmail(toEmail, toName string, templateId int, params map[string]interface{}) error {
	url := "https://api.brevo.com/v3/smtp/email"

	payload := map[string]interface{}{
		"sender": map[string]string{
			"name":  b.SenderName,
			"email": b.SenderEmail,
		},
		"to": []map[string]string{
			{"email": toEmail, "name": toName},
		},
		"templateId": templateId,
		"params":     params,
	}

	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(body))
	req.Header.Add("accept", "application/json")
	req.Header.Add("content-type", "application/json")
	req.Header.Add("api-key", b.ApiKey)
	fmt.Println("Brevo Request Payload:", string(body), b.ApiKey)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}
	fmt.Println("Brevo Response Status:", res)
	defer res.Body.Close()

	respBody, _ := io.ReadAll(res.Body)
	if res.StatusCode != 201 && res.StatusCode != 202 {
		return fmt.Errorf("brevo error: %s", string(respBody))
	}

	fmt.Println("✅ Email sent successfully via Brevo:", string(respBody))
	return nil
}

// SendHTML sends an email using raw HTML content (no template)
func (b *BrevoService) SendHTML(toEmail, toName, subject, html string) error {
	url := "https://api.brevo.com/v3/smtp/email"

	payload := map[string]interface{}{
		"sender": map[string]string{
			"name":  b.SenderName,
			"email": b.SenderEmail,
		},
		"to": []map[string]string{
			{"email": toEmail, "name": toName},
		},
		"subject":     subject,
		"htmlContent": html,
	}

	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(body))
	req.Header.Add("accept", "application/json")
	req.Header.Add("content-type", "application/json")
	req.Header.Add("api-key", b.ApiKey)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}
	defer res.Body.Close()

	respBody, _ := io.ReadAll(res.Body)
	if res.StatusCode != 201 && res.StatusCode != 202 {
		return fmt.Errorf("brevo error: %s", string(respBody))
	}

	fmt.Println("✅ Email sent successfully via Brevo:", string(respBody))
	return nil
}
