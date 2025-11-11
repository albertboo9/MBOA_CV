const admin = require('firebase-admin');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    // Initialize Firebase Admin if not already done
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(require('../serviceAccountKey.json')),
          projectId: 'mboa-cv'
        });
        console.log('Firebase Admin SDK initialized successfully');
      } catch (error) {
        console.error('Firebase Admin SDK initialization failed:', error);
        console.warn('Firebase Admin SDK not initialized - service account key missing or invalid');
      }
    }

    this.paymentsCollection = admin.firestore().collection('payments');
    this.cvsCollection = admin.firestore().collection('cvs');
    this.downloadCodesCollection = admin.firestore().collection('downloadCodes');
  }

  /**
   * Simule l'initiation d'un paiement
   * @param {string} cvId - ID du CV
   * @param {string} userId - ID de l'utilisateur
   * @param {number} amount - Montant en FCFA
   * @returns {Object} Données de paiement
   */
  async initiatePayment(cvId, userId, amount = 1250) {
    try {
      // Vérifier que le CV existe et appartient à l'utilisateur
      const cvDoc = await this.cvsCollection.doc(cvId).get();
      if (!cvDoc.exists) {
        throw new Error('CV not found');
      }

      const cvData = cvDoc.data();
      if (cvData.userId !== userId) {
        throw new Error('Unauthorized access to CV');
      }

      // Créer l'enregistrement de paiement
      const paymentRef = this.paymentsCollection.doc();
      const paymentData = {
        cvId,
        userId,
        amount,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentMethod: 'mobile_money', // Simulé pour le Cameroun
        currency: 'XAF'
      };

      await paymentRef.set(paymentData);

      // Mettre à jour le statut du CV
      await this.cvsCollection.doc(cvId).update({
        status: 'payment_pending',
        paymentId: paymentRef.id,
        paymentAmount: amount,
        paymentInitiatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return {
        paymentId: paymentRef.id,
        paymentUrl: `http://localhost:3000/payment/process/${paymentRef.id}`,
        amount,
        currency: 'XAF'
      };
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw error;
    }
  }

  /**
   * Simule le traitement d'un paiement (succès/échec)
   * @param {string} paymentId - ID du paiement
   * @param {boolean} success - Succès ou échec
   * @returns {Object} Résultat du paiement
   */
  async processPayment(paymentId, success = true) {
    try {
      const paymentRef = this.paymentsCollection.doc(paymentId);
      const paymentDoc = await paymentRef.get();

      if (!paymentDoc.exists) {
        throw new Error('Payment not found');
      }

      const paymentData = paymentDoc.data();

      if (success) {
        // Générer l'ID de transaction
        const transactionId = `TXN_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

        // Paiement réussi
        await paymentRef.update({
          status: 'completed',
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          transactionId: transactionId
        });

        // Mettre à jour le CV
        await this.cvsCollection.doc(paymentData.cvId).update({
          status: 'paid',
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          transactionId: transactionId
        });

        // Générer le code de téléchargement unique
        const downloadCode = await this.generateDownloadCode(paymentData.cvId, paymentData.userId);

        return {
          success: true,
          status: 'completed',
          cvId: paymentData.cvId,
          downloadCode: downloadCode.code,
          transactionId: paymentData.transactionId
        };
      } else {
        // Paiement échoué
        await paymentRef.update({
          status: 'failed',
          failedAt: admin.firestore.FieldValue.serverTimestamp(),
          failureReason: 'Payment cancelled by user'
        });

        // Remettre le CV en draft
        await this.cvsCollection.doc(paymentData.cvId).update({
          status: 'draft',
          paymentId: null
        });

        return {
          success: false,
          status: 'failed',
          cvId: paymentData.cvId,
          reason: 'Payment was cancelled or failed'
        };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  /**
   * Génère un code de téléchargement unique pour un CV
   * @param {string} cvId - ID du CV
   * @param {string} userId - ID de l'utilisateur
   * @returns {Object} Code de téléchargement
   */
  async generateDownloadCode(cvId, userId) {
    try {
      // Générer un code unique (8 caractères alphanumériques)
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();

      const downloadCodeData = {
        code,
        cvId,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Expire dans 1 an
        ),
        isUsed: false,
        downloadCount: 0,
        maxDownloads: 10 // Limite de téléchargements
      };

      await this.downloadCodesCollection.doc(code).set(downloadCodeData);

      return {
        code,
        expiresAt: downloadCodeData.expiresAt.toDate(),
        maxDownloads: downloadCodeData.maxDownloads
      };
    } catch (error) {
      console.error('Download code generation error:', error);
      throw error;
    }
  }

  /**
   * Valide et utilise un code de téléchargement
   * @param {string} code - Code de téléchargement
   * @param {string} userId - ID de l'utilisateur
   * @returns {Object} Informations du CV si valide
   */
  async validateDownloadCode(code, userId) {
    try {
      const codeDoc = await this.downloadCodesCollection.doc(code).get();

      if (!codeDoc.exists) {
        throw new Error('Invalid download code');
      }

      const codeData = codeDoc.data();

      // Vérifications
      if (codeData.userId !== userId) {
        throw new Error('Unauthorized access to download code');
      }

      if (codeData.isUsed && codeData.downloadCount >= codeData.maxDownloads) {
        throw new Error('Download code has expired or reached maximum downloads');
      }

      const now = new Date();
      if (codeData.expiresAt.toDate() < now) {
        throw new Error('Download code has expired');
      }

      // Incrémenter le compteur de téléchargements
      await this.downloadCodesCollection.doc(code).update({
        downloadCount: admin.firestore.FieldValue.increment(1),
        lastDownloadedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Récupérer les informations du CV
      const cvDoc = await this.cvsCollection.doc(codeData.cvId).get();
      if (!cvDoc.exists) {
        throw new Error('CV not found');
      }

      const cvData = cvDoc.data();

      return {
        cvId: codeData.cvId,
        cvData,
        downloadCode: code,
        downloadsRemaining: codeData.maxDownloads - (codeData.downloadCount + 1),
        expiresAt: codeData.expiresAt.toDate()
      };
    } catch (error) {
      console.error('Download code validation error:', error);
      throw error;
    }
  }

  /**
   * Récupère tous les codes de téléchargement d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Array} Liste des codes de téléchargement
   */
  async getUserDownloadCodes(userId) {
    try {
      console.log('Getting download codes for user:', userId);

      // Try the compound query first (requires index)
      try {
        const codesSnapshot = await this.downloadCodesCollection
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .get();

        console.log('Found codes snapshot:', codesSnapshot.size);

        const codes = [];
        codesSnapshot.forEach(doc => {
          const data = doc.data();
          console.log('Processing code:', doc.id, data);

          codes.push({
            code: doc.id,
            cvId: data.cvId,
            createdAt: data.createdAt.toDate(),
            expiresAt: data.expiresAt.toDate(),
            downloadCount: data.downloadCount || 0,
            maxDownloads: data.maxDownloads || 10,
            isExpired: data.expiresAt.toDate() < new Date(),
            downloadsRemaining: Math.max(0, (data.maxDownloads || 10) - (data.downloadCount || 0))
          });
        });

        console.log('Returning codes:', codes.length);
        return codes;

      } catch (indexError) {
        // If index doesn't exist, fall back to getting all codes and filtering client-side
        console.warn('Index not available, falling back to client-side filtering:', indexError.message);

        const allCodesSnapshot = await this.downloadCodesCollection.get();
        const codes = [];

        allCodesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.userId === userId) {
            console.log('Processing code (fallback):', doc.id, data);
            codes.push({
              code: doc.id,
              cvId: data.cvId,
              createdAt: data.createdAt.toDate(),
              expiresAt: data.expiresAt.toDate(),
              downloadCount: data.downloadCount || 0,
              maxDownloads: data.maxDownloads || 10,
              isExpired: data.expiresAt.toDate() < new Date(),
              downloadsRemaining: Math.max(0, (data.maxDownloads || 10) - (data.downloadCount || 0))
            });
          }
        });

        // Sort by createdAt desc
        codes.sort((a, b) => b.createdAt - a.createdAt);

        console.log('Returning codes (fallback):', codes.length);
        return codes;
      }
    } catch (error) {
      console.error('Get user download codes error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();